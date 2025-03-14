import { LogOut, MessageCircle, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useFindUserQuery,
  useGetUserQuery,
} from "../redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, selectCurrentUser } from "../redux/features/auth/authSlice";
import { Link, SetURLSearchParams } from "react-router";
import { useSocket } from "../context/SocketContext";

const Sidebar = ({
  setSearchParmams,
}: {
  setSearchParmams: SetURLSearchParams;
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  const { socket } = useSocket();
  const myId = useAppSelector(selectCurrentUser)?.userId;
  const { data } = useGetUserQuery(myId);
  const user = data?.data || {};

  const { onlineUsers } = useSocket();

  const dispatch = useAppDispatch();

  const { data: searchUsers } = useFindUserQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });

  const searchedUsers = searchUsers?.data || [];

  useEffect(() => {
    if (socket) {
      socket?.emit("sidebar", myId);
      socket?.on("sidebar-conversation", (data) => {
        setConversations(data);
      });
    }
  }, [socket, myId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 2000); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex items-center justify-between z-20">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {!sidebarOpen ? <MessageCircle size={24} /> : <X size={24} />}
        </button>
      </div>
      <div
        className={`mt-12 lg:mt-0 fixed lg:relative w-72 bg-white border-r p-4 inset-y-0 z-10 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "left-0 shadow-lg" : "-left-80 lg:left-0"}`}
      >
        {/* Search Bar */}
        <div>
          <div className="flex items-center bg-gray-200 px-3 py-2 rounded-md mb-4">
            <Search className="text-gray-500" size={18} />
            <input
              type="search"
              placeholder="Search users..."
              className="bg-transparent ml-2 outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {searchedUsers?.length > 0 && search && (
            <div className="max-h-28 overflow-y-auto bg-gray-200 rounded-md p-2 mb-4">
              {searchedUsers?.map((user: any) => (
                <div
                  key={user?._id}
                  className="flex items-center gap-3 cursor-pointer mb-2"
                  onClick={() => {
                    setSearchParmams(`user=${user?._id}`);
                    setSidebarOpen(false);
                    setSearch("");
                  }}
                >
                  <img
                    src={user?.profile_image}
                    alt={user?.name}
                    className="size-8 rounded-full object-cover object-center"
                  />
                  <div className="text-sm text-gray-600">
                    <p>{user?.name}</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users List */}
        <ul>
          {conversations?.map((user: any) => (
            <li
              key={user?._id}
              className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-200 rounded-md`}
              onClick={() => {
                setSearchParmams(`user=${user?._id}`);
                setSidebarOpen(false);
              }}
            >
              <div className="relative">
                <img
                  src={user?.profile_image}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover object-center"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute size-3 rounded-full bg-green-500 top-0 right-0.5"></span>
                )}
              </div>
              <div className="flex-1 flex items-center justify-between w-full">
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p
                    className={`${
                      user?.unseenCount > 0 ? "text-black" : "text-gray-500"
                    } "text-sm  truncate w-40 overflow-hidden"`}
                  >
                    {user?.lastMessage}
                  </p>
                </div>
                {user?.unseenCount > 0 && (
                  <span className="text-xs font-semibold">
                    {user?.unseenCount}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* My Account */}
        <div className="absolute bottom-4 left-4 right-4">
          {accountMenuOpen && (
            <div className="bg-gray-50 shadow-md rounded-md mb-2 p-2">
              <Link to="/profile">
                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-200 rounded-md">
                  <User size={16} /> Profile
                </button>
              </Link>
              <button
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-200 rounded-md"
                onClick={() => dispatch(logout())}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
          <div
            className="flex items-center gap-3 p-2 cursor-pointer bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
          >
            <img
              src={user?.profile_image}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col justify-center">
              <p className="font-medium">{user?.name}</p>
              <small className="text-gray-500">{user?.email}</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
