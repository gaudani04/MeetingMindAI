import { WS_TRANSCRIBE } from "@/lib/config";
import { useCallback, useRef, useState } from "react";

/**
 * Captures microphone + optional screen/tab audio (Zoom, YouTube, etc.),
 * mixes to mono PCM16 @ 16kHz, and streams to the transcription WebSocket.
 */
export default function useAudioWebSocket() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summaries, setSummaries] = useState<string[]>([]);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [lastAnswerSuggestion, setLastAnswerSuggestion] = useState<string | null>(
    null
  );
  const [tabAudioEnabled, setTabAudioEnabled] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);

  const stopRecording = useCallback(() => {
    try {
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
        processorRef.current = null;
      }

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }

      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;

      displayStreamRef.current?.getTracks().forEach((t) => t.stop());
      displayStreamRef.current = null;

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send("STOP");
        ws.current.close();
      }
      ws.current = null;

      setIsRecording(false);
      setTabAudioEnabled(false);
    } catch (err) {
      console.error("Stop error:", err);
    }
  }, []);

  const startRecording = useCallback(async () => {
    let micStream: MediaStream | null = null;
    let displayStream: MediaStream | null = null;

    try {
      setTranscript("");
      setSummaries([]);
      setLastQuestion(null);
      setLastAnswerSuggestion(null);

      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;

      try {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        displayStreamRef.current = displayStream;
        setTabAudioEnabled(displayStream.getAudioTracks().length > 0);
      } catch {
        displayStreamRef.current = null;
        setTabAudioEnabled(false);
      }

      ws.current = new WebSocket(WS_TRANSCRIBE);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data) as {
          type?: string;
          text?: string;
        };

        if (data.type === "transcript" && data.text != null) {
          setTranscript(data.text);
        }

        if (data.type === "summary" && data.text) {
          setSummaries((prev) => [...prev, data.text as string]);
        }

        if (data.type === "question" && data.text != null) {
          setLastQuestion(data.text);
          console.log("QUESTION:", data.text);
        }

        if (data.type === "answer_suggestion" && data.text != null) {
          setLastAnswerSuggestion(data.text);
          console.log("SUGGESTED ANSWER:", data.text);
        }
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const micSource = audioContext.createMediaStreamSource(micStream);
      const gainMic = audioContext.createGain();
      const hasTabAudio =
        !!displayStream && displayStream.getAudioTracks().length > 0;
      gainMic.gain.value = hasTabAudio ? 0.55 : 1;

      const sum = audioContext.createGain();
      micSource.connect(gainMic);
      gainMic.connect(sum);

      if (hasTabAudio && displayStream) {
        const tabSource = audioContext.createMediaStreamSource(displayStream);
        const gainTab = audioContext.createGain();
        gainTab.gain.value = 0.55;
        tabSource.connect(gainTab);
        gainTab.connect(sum);
      }

      sum.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (event) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        const input = event.inputBuffer.getChannelData(0);
        const buffer = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          buffer[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
        }

        ws.current.send(buffer.buffer);
      };

      setIsRecording(true);
    } catch (err) {
      console.error("Error starting capture:", err);
      micStream?.getTracks().forEach((t) => t.stop());
      displayStream?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      displayStreamRef.current = null;
    }
  }, []);

  return {
    isRecording,
    transcript,
    summaries,
    lastQuestion,
    lastAnswerSuggestion,
    tabAudioEnabled,
    startRecording,
    stopRecording,
  };
}
