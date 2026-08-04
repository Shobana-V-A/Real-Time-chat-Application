import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/chats");
    }, [navigate]);

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950">
            
            {/* Animated Background Lights */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

            {/* Main Auth Container */}
            <div className="w-full max-w-md relative z-10 animate-slide-up">
                
                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 mb-3 border border-white/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
                        Pulse<span className="text-blue-400">Chat</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                        Connect & Collaborate in Real-Time
                    </p>
                </div>

                {/* Frosted Glass Card */}
                <div className="glass-card bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/60 text-slate-900 relative">
                    
                    {/* Tab Navigation */}
                    <div className="flex bg-slate-100/80 p-1 rounded-2xl mb-6 border border-slate-200/80 relative">
                        <button
                            type="button"
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 z-10 ${
                                activeTab === "login"
                                    ? "bg-white text-blue-600 shadow-md shadow-blue-500/10"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                            onClick={() => setActiveTab("login")}
                        >
                            🔑 Login
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 z-10 ${
                                activeTab === "signup"
                                    ? "bg-white text-blue-600 shadow-md shadow-blue-500/10"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                            onClick={() => setActiveTab("signup")}
                        >
                            ✨ Sign Up
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="transition-all duration-300">
                        {activeTab === "login" ? <Login /> : <Signup />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;