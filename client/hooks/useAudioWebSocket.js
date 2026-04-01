import { useState, useRef, useCallback } from 'react';

export default function useAudioWebSocket() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summaries, setSummaries] = useState([]);

  const ws = useRef(null);
  const audioContext = useRef(null);
  const processor = useRef(null);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      // 🎤 Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 🌐 WebSocket
      ws.current = new WebSocket('ws://localhost:8000/ws/transcribe');

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "transcript") {
          setTranscript(prev => prev + " " + data.text);
        }

        if (data.type === "summary") {
          setSummaries(prev => [...prev, data.text]);
        }
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      // 🎧 Audio Context (16kHz)
      audioContext.current = new AudioContext({ sampleRate: 16000 });

      const source = audioContext.current.createMediaStreamSource(stream);

      // ⚠️ ScriptProcessor is deprecated but works reliably
      processor.current = audioContext.current.createScriptProcessor(4096, 1, 1);

      source.connect(processor.current);
      processor.current.connect(audioContext.current.destination);

      processor.current.onaudioprocess = (event) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        const input = event.inputBuffer.getChannelData(0);

        // 🔥 Convert Float32 → Int16 (VERY IMPORTANT)
        const buffer = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          buffer[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
        }

        ws.current.send(buffer.buffer); // ✅ send RAW PCM
      };

      setIsRecording(true);

    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    try {
      // 🛑 stop processor
      if (processor.current) {
        processor.current.disconnect();
        processor.current = null;
      }

      // 🛑 stop audio context
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }

      // 🛑 stop mic
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // 🛑 close websocket
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send("STOP");
        ws.current.close();
      }

      setIsRecording(false);

    } catch (err) {
      console.error("Stop error:", err);
    }
  }, []);

  return {
    isRecording,
    transcript,
    summaries,
    startRecording,
    stopRecording
  };
}