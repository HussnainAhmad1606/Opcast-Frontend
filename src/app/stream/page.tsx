"use client"
import React from 'react'
import "@/css/room.css"
import io from 'socket.io-client';
function page() {
    const [username, setUsername] = React.useState('');
    const [roomId, setRoomId] = React.useState('');
    const addParticipantVideo = (id, stream) => {
        if (stream instanceof MediaStream) {
            const videoElement = document.createElement('video');
            videoElement.id = id;
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            document.getElementById('participant-view').appendChild(videoElement);
          } else {
            console.error('The provided stream is not a valid MediaStream:', stream);
          }
      };
      
      const removeParticipantVideo = (id) => {
        const videoElement = document.getElementById(id);
        if (videoElement) {
          videoElement.srcObject.getTracks().forEach(track => track.stop());
          videoElement.remove();
        }
      };

    const join = () => {
        const socket = io("http://localhost:3002");
        socket.emit('joinRoom', { username, roomId });
    
        document.getElementById('join-screen').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
        document.getElementById('participant-view').style.display = 'block';
    
        let localStream;
        let audioEnabled = true;
        let videoEnabled = true;
    
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          .then(stream => {
            localStream = stream;
            addParticipantVideo('local', stream);
    
            // Emit local stream to other participants
            socket.emit('newParticipant', { id: roomId, stream });
    
            // Listen for new participants
            socket.on('newParticipant', ({ id, stream }) => {
                console.log("newParticipant",id,stream)
              addParticipantVideo(id, stream);
            });
    
            // Listen for participant leaving
            socket.on('participantLeft', id => {
              removeParticipantVideo(id);
            });
          })
          .catch(error => {
            console.error('Error accessing media devices.', error);
            alert('Could not access your camera and microphone. Please check your permissions.');
          });
    
        document.getElementById('mute-button').addEventListener('click', () => {
          audioEnabled = !audioEnabled;
          localStream.getAudioTracks()[0].enabled = audioEnabled;
          document.getElementById('mute-button').textContent = audioEnabled ? 'Mute' : 'Unmute';
        });
    
        document.getElementById('video-button').addEventListener('click', () => {
          videoEnabled = !videoEnabled;
          localStream.getVideoTracks()[0].enabled = videoEnabled;
          document.getElementById('video-button').textContent = videoEnabled ? 'Stop Video' : 'Start Video';
        });
    
        document.getElementById('leave-button').addEventListener('click', () => {
          socket.emit('leaveRoom', { username, roomId });
          localStream.getTracks().forEach(track => track.stop());
          socket.disconnect();
    
          document.getElementById('join-screen').style.display = 'block';
          document.getElementById('controls').style.display = 'none';
          document.getElementById('participant-view').style.display = 'none';
          document.getElementById('participant-view').innerHTML = '';
        });
    
        socket.on('roomJoined', (data) => {
          console.log(`Joined room ${data.roomId} as ${data.username}`);
        });
    
        socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          alert('Connection failed. Please try again.');
        });
    }
  return (
<>
    <div id="join-screen">
       <h2>Join Room</h2>
       <input type="text" id="username" value={username} onChange={(e:any)=>setUsername(e.target.value)} placeholder="Enter your name"/>
       <input type="text" id="room-id" onChange={(e:any)=>setRoomId(e.target.value)} placeholder="Enter room ID"/>
       <button id="join-button" onClick={join}>Join</button>
     </div>
     <div id="controls" style={{display: "none"}}>
     </div>
     <div id="participant-view" style={{display: "none"}}>
    
     </div>
     <div id="controls" style={{display: "none"}}>
  <button id="mute-button">Mute</button>
  <button id="video-button">Stop Video</button>
  <button id="leave-button">Leave Room</button>
</div>
     </>
  )
}

export default page