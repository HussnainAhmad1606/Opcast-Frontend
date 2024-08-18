import { useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      wsRef.current.onmessage = (event) => {
        if (onMessage) onMessage(event);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed, retrying...');
        setTimeout(() => connectWebSocket(), 1000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [url, onMessage]);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket is not open');
    }
  };

  return { sendMessage };
};

export default useWebSocket;
