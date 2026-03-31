import { useState, useRef, useCallback } from 'react';

export default function useAudioWebSocket() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const ws = useRef(null);
  const mediaRecorder = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      ws.current = new WebSocket('ws://localhost:8000/ws/transcribe');
      
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTranscript(data.transcript);
      };

      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(event.data);
        }
      };

      mediaRecorder.current.start(3000); // Send chunks every 3s
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send("STOP");
      ws.current.close();
    }
    setIsRecording(false);
  }, []);

  return { isRecording, transcript, startRecording, stopRecording };
}