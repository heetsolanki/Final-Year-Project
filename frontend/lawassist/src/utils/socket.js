import { io } from "socket.io-client";
import API_URL from "../api";

let socket;

export const connectSocket = (token) => {
  socket = io(API_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;