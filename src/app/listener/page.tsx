// pages/listener.js
"use client"
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Device } from 'mediasoup-client';

const ListenerPage = () => {
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

  const startListening = async () => {
    if (!device) return;

    // Create Consumer Transport
    const { routerRtpCapabilities } = await new Promise((resolve) => {
      socket.emit('createConsumerTransport', resolve);
    });

    await device.load({ routerRtpCapabilities });

    const consumerTransport = device.createRecvTransport(await new Promise((resolve) => {
      socket.emit('createConsumerTransport', resolve);
    }));

    consumerTransport.on('connect', ({ dtlsParameters }, callback) => {
      socket.emit('connectConsumerTransport', { dtlsParameters }, callback);
    });

    const { rtpCapabilities } = device;
    const { id, producerId, kind, rtpParameters } = await new Promise((resolve) => {
      socket.emit('consume', { rtpCapabilities }, resolve);
    });

    const consumer = await consumerTransport.consume({ id, producerId, kind, rtpParameters });

    const audioElement = new Audio();
    audioElement.srcObject = new MediaStream([consumer.track]);
    audioElement.play();
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
    </div>
  );
};

export default ListenerPage;
