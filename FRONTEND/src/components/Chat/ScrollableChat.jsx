import { ChatState } from "../../context/ChatProvider";

const ScrollableChat = ({ messages, onViewProfile }) => {
    const { user } = ChatState();

    const isImage = (content) => {
        return content.includes("cloudinary.com") || content.startsWith("data:image/");
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col gap-3 py-2">
            {messages &&
                messages.map((m) => {
                    const isCurrentUser = m.sender._id === user._id;

                    return (
                        <div
                            key={m._id}
                            className={`flex items-end gap-2 ${
                                isCurrentUser ? "justify-end" : "justify-start"
                            } group animate-slide-up`}
                        >
                            {/* Chat Partner Avatar */}
                            {!isCurrentUser && (
                                <img
                                    src={m.sender.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt={m.sender.name}
                                    className="w-7 h-7 rounded-xl object-cover ring-2 ring-slate-700 cursor-pointer hover:ring-blue-500 transition shadow-sm mb-0.5"
                                    title={`Click to view ${m.sender.name}'s profile`}
                                    onClick={() => onViewProfile && onViewProfile(m.sender)}
                                />
                            )}

                            {/* Message Bubble Container */}
                            <div
                                className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                                    isCurrentUser ? "items-end" : "items-start"
                                }`}
                            >
                                {/* Sender Name (In group chats for incoming messages) */}
                                {!isCurrentUser && (
                                    <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">
                                        {m.sender.name}
                                    </span>
                                )}

                                <div
                                    className={`px-3.5 py-2 rounded-2xl text-sm font-medium leading-relaxed tracking-wide shadow-md ${
                                        isCurrentUser
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-blue-500/10"
                                            : "bg-slate-800/90 text-slate-100 border border-slate-700/70 rounded-bl-xs"
                                    } ${isImage(m.content) ? "p-1.5 bg-slate-900/80 border border-slate-800" : ""}`}
                                >
                                    {isImage(m.content) ? (
                                        <div className="relative group/img overflow-hidden rounded-xl">
                                            <img
                                                src={m.content}
                                                alt="attachment"
                                                className="max-h-64 rounded-xl object-cover cursor-pointer hover:scale-105 transition-all duration-200 shadow-md"
                                                onClick={() => window.open(m.content, "_blank")}
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1 pointer-events-none">
                                                <span>🔍</span>
                                                <span>Click to expand</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                                    )}

                                    {/* Timestamp & WhatsApp Ticks */}
                                    <div
                                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                            isCurrentUser ? "text-blue-100/80" : "text-slate-400"
                                        }`}
                                    >
                                        <span>{formatTime(m.createdAt)}</span>
                                        {isCurrentUser && (
                                            <span className="text-blue-200 font-extrabold ml-0.5 tracking-tighter text-[11px]" title="Delivered">
                                                ✓✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default ScrollableChat;