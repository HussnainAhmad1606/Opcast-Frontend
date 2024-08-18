"use client"
import { useEffect, useRef } from 'react';
import useWebSocket from '../../hooks/useWebSocket';

const Streamer = () => {
  const { sendMessage } = useWebSocket('ws://localhost:3000');
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create an AudioContext
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        // Create a MediaRecorder
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            event.data.arrayBuffer().then((arrayBuffer) => {
              sendMessage(arrayBuffer);
            });
          }
        };

        mediaRecorderRef.current.start(100); // Send data every 100ms
      } catch (error) {
        console.error('Error starting streaming:', error);
      }
    };

    startStreaming();

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [sendMessage]);

  return <div>Streamer</div>;
};

export default Streamer;
