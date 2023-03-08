import { io } from "socket.io-client";
import env from "./env";

export const socket = io(env.SOCKET_URL, {
    transports: ["websocket"],
    //reconnection: true,
    withCredentials: true,
});
