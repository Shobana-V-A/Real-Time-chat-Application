import { useState } from "react";

const EMOJI_CATEGORIES = [
    {
        name: "Quick",
        emojis: ["👍", "❤️", "😂", "🔥", "🎉", "🚀", "🙏", "😍", "😊", "✨"],
    },
    {
        name: "Faces",
        emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😋"],
    },
    {
        name: "Gestures",
        emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "✋", "🤚", "🖐️", "🖖", "👋", "🤝", "👏", "🙌"],
    },
    {
        name: "Symbols",
        emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💯", "🔥"],
    },
];

const EmojiPicker = ({ onSelectEmoji, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-16 left-2 z-50 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            
            {/* Category Header */}
            <div className="flex bg-slate-800/80 border-b border-slate-700/60 p-1.5 gap-1">
                {EMOJI_CATEGORIES.map((cat, index) => (
                    <button
                        key={cat.name}
                        type="button"
                        onClick={() => setActiveTab(index)}
                        className={`flex-1 py-1 text-xs font-bold rounded-lg transition ${
                            activeTab === index
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={onClose}
                    className="px-2 text-slate-400 hover:text-white font-bold text-sm"
                >
                    &times;
                </button>
            </div>

            {/* Emojis Grid */}
            <div className="p-3 grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                            onSelectEmoji(emoji);
                        }}
                        className="text-xl p-2 rounded-xl hover:bg-slate-800 hover:scale-125 transition-all duration-150 flex items-center justify-center"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;
