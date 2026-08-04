import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const openMyProfile = () => {
        setViewingUser(user);
        setIsProfileOpen(true);
    };

    const openUserProfile = (selectedUser, e) => {
        if (e) e.stopPropagation();
        setViewingUser(selectedUser);
        setIsProfileOpen(true);
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please enter a name or email to search");
            return;
        }

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

            const { data } = await axios.get(
                `${backendUrl}/api/user?search=${search}`,
                config
            );

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Failed to load search results");
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

            const { data } = await axios.post(
                `${backendUrl}/api/chat`,
                { userId },
                config
            );

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setIsDrawerOpen(false);
        } catch (error) {
            alert("Error fetching the chat");
        }
    };

    return (
        <>
            {/* Top Navbar */}
            <header className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 flex justify-between items-center shadow-lg relative z-20">
                
                {/* Search Button */}
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl transition border border-slate-700/50 shadow-inner group"
                >
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-xs font-semibold hidden md:inline">Search users</span>
                    <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-900 rounded border border-slate-700">
                        ⌘K
                    </kbd>
                </button>

                {/* Brand Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 border border-white/20">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white font-outfit">
                        Pulse<span className="text-blue-400">Chat</span>
                    </h1>
                </div>

                {/* Action Items & Profile */}
                <div className="flex items-center gap-3">
                    
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700/50 transition relative"
                            title="Notifications"
                        >
                            🔔
                            {notification.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                                    {notification.length}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl rounded-2xl overflow-hidden z-50 animate-slide-up">
                                <div className="p-3 bg-slate-800/50 border-b border-slate-800 text-xs font-bold uppercase text-slate-400 tracking-wider">
                                    Notifications
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {!notification.length ? (
                                        <div className="p-4 text-center text-slate-500 text-xs font-medium">
                                            No new notifications
                                        </div>
                                    ) : (
                                        notification.map((notif) => (
                                            <div
                                                key={notif._id}
                                                className="p-3 border-b border-slate-800/50 hover:bg-blue-600/10 cursor-pointer text-xs font-medium text-slate-200 transition flex items-center gap-2"
                                                onClick={() => {
                                                    setSelectedChat(notif.chat);
                                                    setNotification(notification.filter((n) => n !== notif));
                                                    setIsNotifOpen(false);
                                                }}
                                            >
                                                <span className="text-blue-400 font-bold">💬</span>
                                                <span>
                                                    {notif.chat.isGroupChat
                                                        ? `New message in ${notif.chat.chatName}`
                                                        : `New message from ${getSender(user, notif.chat.users)}`}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logged in User Profile Trigger */}
                    <button
                        onClick={openMyProfile}
                        className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-700/90 pl-1.5 pr-3 py-1.5 rounded-xl border border-slate-700/60 transition shadow-sm group"
                        title="View & Edit Profile"
                    >
                        <div className="relative">
                            <img
                                src={user?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                alt={user?.name}
                                className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/40"
                            />
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                        </div>
                        <span className="font-semibold text-slate-200 text-xs hidden sm:block group-hover:text-white">
                            {user?.name}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded uppercase">
                            Me
                        </span>
                    </button>

                    <button
                        onClick={logoutHandler}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-xl transition border border-rose-500/20"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Overlay Drawer */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 transition-opacity"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Sliding Drawer Panel */}
            <aside
                className={`fixed top-0 left-0 h-full w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-r border-slate-800 flex flex-col ${
                    isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div>
                        <h2 className="text-base font-bold text-white font-outfit">Search Users</h2>
                        <p className="text-xs text-slate-400">Find people to start chatting</p>
                    </div>
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="text-slate-400 hover:text-white font-bold text-xl w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 transition"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 px-3.5 py-2 bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-md shadow-blue-600/20"
                    >
                        Go
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 text-sm font-medium">
                            Searching users...
                        </div>
                    ) : (
                        searchResult?.map((searchedUser) => (
                            <div
                                key={searchedUser._id}
                                onClick={() => accessChat(searchedUser._id)}
                                className="flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800 rounded-xl cursor-pointer transition border border-slate-800/80 group"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={searchedUser.pic}
                                        alt={searchedUser.name}
                                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700 group-hover:ring-blue-500 transition"
                                    />
                                    <div>
                                        <p className="font-bold text-slate-100 text-sm">{searchedUser.name}</p>
                                        <p className="text-xs text-slate-400">{searchedUser.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => openUserProfile(searchedUser, e)}
                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition"
                                    title="View Profile Details"
                                >
                                    👁️
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Profile Modal */}
            <ProfileModal
                user={viewingUser}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                isEditable={viewingUser?._id === user?._id}
            />
        </>
    );
};

export default SideDrawer;