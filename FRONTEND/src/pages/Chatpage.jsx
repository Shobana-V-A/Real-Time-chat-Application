import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/Chat/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import ToastNotification from "../components/Chat/ToastNotification";

const Chatpage = () => {
    const { user, notification, setSelectedChat, setNotification } = ChatState();

    const latestNotif = notification.length > 0 ? notification[0] : null;

    return (
        <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden relative selection:bg-blue-500 selection:text-white">
            
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Navigation Header */}
            {user && <SideDrawer />}

            {/* Main Workspace Container */}
            <div className="flex flex-1 justify-between p-2 sm:p-4 gap-3 sm:gap-4 overflow-hidden relative z-10">
                {user && <MyChats />}
                {user && <ChatBox />}
            </div>

            {/* Live Floating Toast Notification */}
            {user && latestNotif && (
                <ToastNotification
                    latestNotification={latestNotif}
                    currentUser={user}
                    onSelectChat={(chat) => {
                        setSelectedChat(chat);
                        setNotification(notification.filter((n) => n !== latestNotif));
                    }}
                    onClose={() => {
                        setNotification(notification.filter((n) => n !== latestNotif));
                    }}
                />
            )}
        </div>
    );
};

export default Chatpage;