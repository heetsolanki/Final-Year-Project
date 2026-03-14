import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import API_URL from "../api";

const useSocket = (token) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(API_URL, {
      auth: { token },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  return socketRef;
};

export default useSocket;
