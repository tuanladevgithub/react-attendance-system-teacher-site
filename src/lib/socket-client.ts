import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Socket, io } from "socket.io-client";

export const socket: Socket = io(ATTENDANCE_API_DOMAIN, {
  transports: ["websocket"],
  autoConnect: false,
});
