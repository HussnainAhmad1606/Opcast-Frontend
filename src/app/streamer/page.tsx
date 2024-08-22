// pages/streamer.js
"use client"
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Device } from 'mediasoup-client';

const StreamerPage = () => {
  const [device, setDevice] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3002');
    setSocket(socket);

    socket.on('connect', async () => {
      const device = new Device();
      setDevice(device);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startStreaming = async () => {
    if (!device) return;

    // Create Producer Transport
    const { routerRtpCapabilities } = await new Promise((resolve) => {
      socket.emit('createProducerTransport', resolve);
    });

    await device.load({ routerRtpCapabilities });

    const producerTransport = device.createSendTransport(await new Promise((resolve) => {
      socket.emit('createProducerTransport', resolve);
    }));

    producerTransport.on('connect', ({ dtlsParameters }, callback) => {
      socket.emit('connectProducerTransport', { dtlsParameters }, callback);
    });

    producerTransport.on('produce', async (parameters, callback) => {
      const { id } = await new Promise((resolve) => {
        socket.emit('produce', parameters, resolve);
      });
      callback({ id });
    });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioTrack = stream.getAudioTracks()[0];
    await producerTransport.produce({ track: audioTrack });
  };

  return (
    <div>
      <button onClick={startStreaming}>Start Streaming</button>
    </div>
  );
};

export default StreamerPage;
