import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentToken } from "../redux/features/auth/authSlice";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const token = useAppSelector(selectCurrentToken);

  useEffect(() => {
    if (token) {
      const socket = io(
        "https://chat-app-backend-production-ec7b.up.railway.app",
        {
          auth: { token },
        }
      );

      socket.on("onlineUsers", (data) => {
        setOnlineUsers(data);
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
