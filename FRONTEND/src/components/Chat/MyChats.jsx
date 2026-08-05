import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            const { data } = await axios.get(`${backendUrl}/api/chat`, config);
            setChats(data);
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, []);

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        return isToday
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const filteredChats = chats?.filter((c) => {
        const chatName = !c.isGroupChat ? getSender(loggedUser, c.users) : c.chatName;
        return chatName?.toLowerCase().includes(filterQuery.toLowerCase());
    });

    return (
        <aside className={`w-full md:w-80 lg:w-96 bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-800/90 p-4 flex-col h-full shadow-2xl overflow-hidden ${selectedChat ? "hidden md:flex" : "flex"}`}>
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                <div>
                    <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                        <span>💬</span>
                        <span>Chats</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                        {chats?.length || 0} conversations
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center gap-1"
                >
                    <span>👥</span>
                    <span>New Group +</span>
                </button>
            </div>

            {/* Filter Search Input */}
            <div className="mt-3">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs pointer-events-none">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search or start new chat..."
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* List of active chats */}
            <div className="flex-1 overflow-y-auto mt-3 space-y-1.5 pr-1">
                {filteredChats ? (
                    filteredChats.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs">
                            No conversations found
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const isSelected = selectedChat?._id === chat._id;
                            const chatPartnerName = !chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName;
                            const chatPartnerUser = !chat.isGroupChat ? chat.users?.find(u => u._id !== loggedUser?._id) : null;

                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`cursor-pointer p-3 rounded-2xl transition-all flex items-center gap-3 border ${
                                        isSelected
                                            ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white border-blue-400/50 shadow-lg shadow-blue-500/20"
                                            : "bg-slate-800/40 text-slate-200 hover:bg-slate-800/80 border-slate-800/60"
                                    }`}
                                >
                                    {/* Avatar Display */}
                                    <div className="relative shrink-0">
                                        {!chat.isGroupChat ? (
                                            <img
                                                src={chatPartnerUser?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                                alt={chatPartnerName}
                                                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-700/50"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                                                👥
                                            </div>
                                        )}
                                        {!chat.isGroupChat && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                                        )}
                                    </div>

                                    {/* Chat Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`font-bold text-sm truncate ${isSelected ? "text-white" : "text-slate-100"}`}>
                                                {chatPartnerName}
                                            </h3>
                                            {chat.latestMessage && (
                                                <span className={`text-[10px] shrink-0 font-medium ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                                                    {formatTime(chat.latestMessage.createdAt)}
                                                </span>
                                            )}
                                        </div>

                                        {chat.latestMessage ? (
                                            <p className={`text-xs truncate font-medium flex items-center gap-1 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                                                {chat.latestMessage.sender._id === loggedUser?._id && (
                                                    <span className="text-blue-400 font-bold">✓</span>
                                                )}
                                                <span className="font-semibold">
                                                    {chat.latestMessage.sender._id === loggedUser?._id ? "You" : chat.latestMessage.sender.name}: 
                                                </span>
                                                <span>
                                                    {chat.latestMessage.content.includes("cloudinary.com") ? "📷 Photo" : chat.latestMessage.content}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className={`text-xs italic ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                                                No messages yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )
                ) : (
                    <div className="text-center py-10 text-slate-500 text-xs">
                        Loading conversations...
                    </div>
                )}
            </div>

            {/* Render Group Chat Modal */}
            <GroupChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </aside>
    );
};

export default MyChats;