import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useSearchParams } from "react-router";

const MessengerPage = () => {
  const [searchParmams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // const socket = useRef<Socket | null>(null);

  const selectedUser = searchParmams?.get("user") || "";

  const sendMessage = () => {};

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Navbar (Mobile Only) */}

      {/* Sidebar */}
      <Sidebar />

      {/* Chat Window */}
      <div className="mt-12 lg:mt-0 flex-1 flex flex-col bg-white p-4">
        {selectedUser ? (
          <>
            <div className="border-b pb-3 mb-3 flex gap-2 items-center">
              {/* <img
                src={users.find((user) => user.id === selectedUser)?.image}
                alt="profile-image"
                className="size-8 rounded-full"
              /> */}
              <h2 className="text-lg font-semibold">
                {/* {users.find((user) => user.id === selectedUser)?.name} */}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {/* {messages.length > 0 ? (
                messages.map((msg: any, index: number) => (
                  <div
                    key={index}
                    className={`max-w-xs px-4 py-2 rounded-md ${
                      msg.sender === "You"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.text}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="sent-image"
                        className="mt-2 max-w-full rounded-lg"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  Start your conversation
                </p>
              )} */}
            </div>

            {/* Message Input and Image Upload */}
            <div className="mt-4 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Paperclip size={24} />
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2  border rounded-lg focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center text-gray-500">
            Start your conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerPage;
