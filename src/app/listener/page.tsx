"use client"
import { useEffect, useRef } from 'react';
import useWebSocket from '../../hooks/useWebSocket';

const Listener = () => {
  const audioContextRef = useRef(null);
  const handleAudioData = (event) => {
    if (audioContextRef.current && event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        audioContextRef.current.decodeAudioData(arrayBuffer, (buffer) => {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContextRef.current.destination);
          source.start(0);
        }, (error) => {
          console.error('Error decoding audio data:', error);
        });
      };
      reader.readAsArrayBuffer(event.data);
    } else {
      console.error('Unexpected data format:', event.data);
    }
  };
  

  const { sendMessage } = useWebSocket('ws://localhost:3000', handleAudioData);

  useEffect(() => {
    // Create an AudioContext
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return <div>Listener</div>;
};

export default Listener;
