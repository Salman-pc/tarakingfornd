import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (url = 'http://localhost:9000') => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('🔌 Connecting to socket server:', url);
    const socketInstance = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });
    
    setSocket(socketInstance);
    
    return () => {
      console.log('🧹 Disconnecting socket');
      socketInstance.disconnect();
    };
  }, [url]);

  return socket;
};
