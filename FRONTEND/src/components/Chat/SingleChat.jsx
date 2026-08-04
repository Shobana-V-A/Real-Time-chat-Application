import { useEffect, useState, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ProfileModal from "./ProfileModal";

var socket, selectedChatCompare;

const SingleChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);

    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const [imageLoading, setImageLoading] = useState(false);
    const fileInputRef = useRef(null);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const endpoint = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        socket = io(endpoint);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));

        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
        };
    }, [user, endpoint]);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            setLoading(true);
            const { data } = await axios.get(`${endpoint}/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.error("Failed to load messages:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });

        return () => {
            socket.off("message received");
        };
    });

    const sendDataMessage = async (contentToSend) => {
        if (!contentToSend.trim()) return;
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setNewMessage("");

            const { data } = await axios.post(
                `${endpoint}/api/message`,
                {
                    content: contentToSend,
                    chatId: selectedChat._id,
                },
                config
            );

            setMessages([...messages, data]);
            socket.emit("new message", data);
        } catch (error) {
            alert("Failed to send message");
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
            sendDataMessage(newMessage);
        }
    };

    const handleSendClick = () => {
        if (newMessage) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
            sendDataMessage(newMessage);
        }
    };

    const postDetails = (pics) => {
        if (!pics) return;
        setImageLoading(true);

        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/webp") {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (cloudName && uploadPreset) {
                const data = new FormData();
                data.append("file", pics);
                data.append("upload_preset", uploadPreset);
                data.append("cloud_name", cloudName);

                fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: data,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.secure_url || data.url) {
                            sendDataMessage(data.secure_url || data.url);
                        } else {
                            readAndSendBase64(pics);
                        }
                        setImageLoading(false);
                    })
                    .catch(() => {
                        readAndSendBase64(pics);
                    });
            } else {
                readAndSendBase64(pics);
            }
        } else {
            alert("Please select a valid image file");
            setImageLoading(false);
        }
    };

    const readAndSendBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            sendDataMessage(reader.result);
            setImageLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const chatPartner = selectedChat && !selectedChat.isGroupChat ? getSenderFull(user, selectedChat.users) : null;

    return (
        <div className="flex flex-col h-full w-full relative">
            {selectedChat ? (
                <>
                    {/* Active Chat Header */}
                    <div className="pb-3 border-b border-slate-800/80 flex justify-between items-center shrink-0">
                        
                        <div className="flex items-center gap-3">
                            {/* Mobile Back Button */}
                            <button
                                className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
                                onClick={() => setSelectedChat("")}
                            >
                                ⬅
                            </button>

                            {/* Recipient / Group Avatar */}
                            <div className="relative">
                                {!selectedChat.isGroupChat ? (
                                    <img
                                        src={chatPartner?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                        alt={chatPartner?.name}
                                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-500/30"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                        👥
                                    </div>
                                )}
                                {!selectedChat.isGroupChat && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-100 text-sm sm:text-base font-outfit">
                                    {!selectedChat.isGroupChat ? chatPartner?.name : selectedChat.chatName}
                                </h3>
                                <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>{!selectedChat.isGroupChat ? "Active Now" : `${selectedChat.users.length} members`}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div>
                            {selectedChat.isGroupChat ? (
                                <>
                                    <button
                                        onClick={() => setIsUpdateModalOpen(true)}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-700/60 shadow-sm flex items-center gap-1.5"
                                    >
                                        <span>⚙️</span>
                                        <span>Group Settings</span>
                                    </button>
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                        isOpen={isUpdateModalOpen}
                                        onClose={() => setIsUpdateModalOpen(false)}
                                    />
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setViewingUser(chatPartner);
                                        setIsProfileOpen(true);
                                    }}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border border-slate-700/60 shadow-sm flex items-center gap-1.5"
                                >
                                    <span>👁️</span>
                                    <span>View Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto my-3 p-3 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex flex-col justify-end relative">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    <span>Loading conversation history...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-1 flex flex-col">
                                <ScrollableChat
                                    messages={messages}
                                    onViewProfile={(senderUser) => {
                                        setViewingUser(senderUser);
                                        setIsProfileOpen(true);
                                    }}
                                />
                            </div>
                        )}

                        {/* Typing indicator */}
                        {istyping && (
                            <div className="mt-2 ml-2 text-xs text-blue-400 italic flex items-center gap-1 font-medium bg-blue-500/10 px-3 py-1 rounded-full w-fit border border-blue-500/20">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                <span className="ml-1">typing...</span>
                            </div>
                        )}
                    </div>

                    {/* Bottom Input Area */}
                    <div className="shrink-0 pt-1">
                        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-xl">
                            
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => postDetails(e.target.files[0])}
                                className="hidden"
                            />

                            {/* Attachment Button */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                disabled={imageLoading}
                                className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700/60 rounded-xl transition disabled:opacity-50"
                                title="Attach Image"
                            >
                                📎
                            </button>

                            <input
                                type="text"
                                placeholder={imageLoading ? "Uploading image..." : "Type a message..."}
                                value={newMessage}
                                onChange={typingHandler}
                                onKeyDown={sendMessage}
                                disabled={imageLoading}
                                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
                            />

                            {/* Send Button */}
                            <button
                                onClick={handleSendClick}
                                disabled={!newMessage.trim() || imageLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold p-2.5 rounded-xl transition shadow-md shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                                title="Send Message"
                            >
                                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center mb-4 text-3xl shadow-xl shadow-blue-500/10">
                        💬
                    </div>
                    <h2 className="text-2xl font-bold text-white font-outfit mb-2">
                        Welcome to Pulse<span className="text-blue-400">Chat</span>
                    </h2>
                    <p className="text-sm text-slate-400 max-w-sm font-medium leading-relaxed">
                        Select a conversation from the left sidebar or search users to start messaging.
                    </p>
                </div>
            )}

            {/* Profile Modal */}
            <ProfileModal
                user={viewingUser}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                isEditable={viewingUser?._id === user?._id}
            />
        </div>
    );
};

export default SingleChat;