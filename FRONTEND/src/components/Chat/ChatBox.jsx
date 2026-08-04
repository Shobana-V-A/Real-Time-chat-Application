import { ChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
    const { selectedChat } = ChatState();

    return (
        <main
            className={`flex-1 bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-800/90 p-4 flex-col h-full shadow-2xl overflow-hidden relative ${
                selectedChat ? "flex" : "hidden md:flex"
            }`}
        >
            <SingleChat />
        </main>
    );
};

export default ChatBox;