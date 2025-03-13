import { Send } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { IMessage } from "../types/message";

const MessengerPage = () => {
  const [searchParmams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    name: string;
    email: string;
    profile_image: string;
  } | null>(null);
  const [conversations, setConversations] = useState<IMessage[] | []>([]);
  const selectedUserId = searchParmams?.get("user") || "";
  const { socket, onlineUsers } = useSocket();
  const userId = useAppSelector(selectCurrentUser)?.userId;

  const myId = useAppSelector(selectCurrentUser)?.userId;

  useEffect(() => {
    if (socket && selectedUserId) {
      socket.emit("message-page", selectedUserId);
      socket.on("message-user", (data) => {
        setSelectedUser(data);
      });
      socket.on("conversation", (data) => {
        setConversations(data);
      });
      socket.on("message", (data) => {
        if (
          data.sender.toString() === selectedUserId.toString() ||
          data.receiver.toString() === selectedUserId.toString()
        ) {
          setConversations((prev) => [data, ...prev]);
        }
      });
      socket.emit("seen-message", selectedUserId);
    }
  }, [selectedUserId, socket]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const message = form.message?.value?.trim();
    if (!message) return;
    const data = {
      sender: userId,
      receiver: selectedUserId,
      message,
    };
    if (socket) {
      socket.emit("new-message", data);
    }
    form.reset();
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat Window */}
      <div className="mt-12 lg:mt-0 flex-1 flex flex-col bg-white p-4">
        {selectedUser ? (
          <>
            <div className="border-b pb-3 mb-3 flex gap-3 items-center">
              <div className="relative">
                <img
                  src={selectedUser?.profile_image}
                  alt={selectedUser?.name}
                  className="w-10 h-10 rounded-full object-cover object-center"
                />
                {onlineUsers?.includes(selectedUser?._id) && (
                  <span className="absolute size-3 rounded-full bg-green-500 top-0 right-0.5"></span>
                )}
              </div>
              <h2 className="text-lg font-semibold">{selectedUser?.name}</h2>
            </div>

            <div className="flex-1 flex flex-col-reverse overflow-y-auto gap-2">
              {conversations?.length > 0 &&
                conversations.map((msg: IMessage, index: number) => (
                  <div
                    key={index}
                    className={`max-w-sm px-4 py-2 rounded-md ${
                      msg.sender === myId
                        ? "bg-blue-500 text-white ms-auto text-right"
                        : "bg-gray-200 mr-auto"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
            </div>

            {/* Message Input and Image Upload */}
            <form
              onSubmit={sendMessage}
              className="mt-4 flex items-center gap-3"
            >
              <input
                type="text"
                name="message"
                defaultValue=""
                placeholder="Type a message"
                autoComplete="off"
                className="flex-1 px-4 py-2  border rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2  rounded-lg w-16 flex justify-center items-center"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center text-gray-500">
            <p className="text-2xl">Start your conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerPage;
