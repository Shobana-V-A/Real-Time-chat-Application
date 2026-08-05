import { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";

const ToastNotification = ({ latestNotification, currentUser, onSelectChat, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (latestNotification) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [latestNotification, onClose]);

    if (!visible || !latestNotification) return null;

    const senderName = latestNotification.chat.isGroupChat
        ? latestNotification.chat.chatName
        : getSender(currentUser, latestNotification.chat.users);

    const messageContent = latestNotification.content?.includes("cloudinary.com")
        ? "📷 Photo attachment"
        : latestNotification.content;

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-up max-w-sm w-full">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 p-4 rounded-2xl shadow-2xl shadow-blue-500/10 flex items-center justify-between gap-3 relative overflow-hidden group">
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 w-full animate-pulse" />

                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
                        🔔
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="font-bold text-slate-100 text-xs tracking-wide truncate">
                                {senderName}
                            </h4>
                            <span className="text-[10px] text-blue-400 font-semibold uppercase">New Message</span>
                        </div>
                        <p className="text-xs text-slate-300 truncate">
                            {messageContent}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setVisible(false);
                            onSelectChat(latestNotification.chat);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition shadow-md shadow-blue-600/30"
                    >
                        View
                    </button>
                    <button
                        onClick={() => setVisible(false)}
                        className="text-slate-400 hover:text-white text-base font-bold px-1"
                    >
                        &times;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToastNotification;
