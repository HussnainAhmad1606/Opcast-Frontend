"use client";

import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const PeerPage = () => {
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [participants, setParticipants] = useState<{ [id: string]: MediaStream }>({});
  const [speakingPeerId, setSpeakingPeerId] = useState<string | null>(null);

  const generateRandomString = () => Math.random().toString(36).substring(2);

  const handleJoinRoom = () => {
    fetch('http://localhost:3002/join-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId, peerId: myUniqueId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Joined room:', data.roomId);
      console.log('Participants:', data.peerIds);
      data.peerIds.forEach(peerId => {
        if (peerInstance) {
          peerInstance.on('call', call => {
            if (call.peer === peerId) {
              console.log('Incoming call from peer:', peerId);
              call.answer();
              call.on('stream', userStream => {
                console.log('Received audio stream from peer:', peerId);
                setParticipants(prev => ({ ...prev, [peerId]: userStream }));
                analyzeAudioStream(userStream, peerId);
              });
            }
          });
        }
      });
    });
  };

  useEffect(() => {
    if (myUniqueId) {
      const peer = new Peer(myUniqueId, {
        host: 'localhost',
        port: 3002,
        path: '/myapp',
      });

      setPeerInstance(peer);

      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        console.log('Sending local audio stream');
        peer.on('call', call => {
          call.answer(stream);
          call.on('stream', userStream => {
            console.log('Received audio stream from peer:', call.peer);
            setParticipants(prev => ({ ...prev, [call.peer]: userStream }));
            analyzeAudioStream(userStream, call.peer);
          });
        });
      });

      peer.on('disconnected', () => {
        console.log('Peer disconnected:', peer.id);
        setParticipants(prev => {
          const updatedParticipants = { ...prev };
          delete updatedParticipants[peer.id];
          return updatedParticipants;
        });
      });

      return () => {
        peer.destroy();
      };
    }
  }, [myUniqueId]);

  useEffect(() => {
    setMyUniqueId(generateRandomString());
  }, []);

  const analyzeAudioStream = (stream: MediaStream, peerId: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const checkAudioLevels = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      if (average > 50) { // Adjust threshold as needed
        if (speakingPeerId !== peerId) {
          setSpeakingPeerId(peerId);
          console.log(`Peer ${peerId} is speaking.`);
        }
      } else {
        if (speakingPeerId === peerId) {
          setSpeakingPeerId(null);
          console.log(`Peer ${peerId} stopped speaking.`);
        }
      }
      requestAnimationFrame(checkAudioLevels);
    };

    checkAudioLevels();
  };

  return (
    <div className='flex flex-col justify-center items-center p-12'>
      <p>Your ID: {myUniqueId}</p>
      <input
        className='text-black'
        placeholder="Room ID"
        value={roomId}
        onChange={e => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
      <div>
        {Object.keys(participants).map(peerId => (
          <audio
            key={peerId}
            className='w-72'
            ref={el => (audioRefs.current[peerId] = el as HTMLAudioElement)}
            autoPlay
            controls
          />
        ))}
      </div>
      {speakingPeerId && <p>Currently Speaking: {speakingPeerId}</p>}
    </div>
  );
};

export default PeerPage;
