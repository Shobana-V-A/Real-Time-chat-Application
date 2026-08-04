import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const config = {
                headers: { "Content-type": "application/json" },
            };
            setLoading(true);

            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            const { data } = await axios.post(
                `${backendUrl}/api/user/login`,
                { email, password },
                config
            );

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert(error.response?.data?.message || "Invalid Email or Password");
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        const guestEmail = "guest@example.com";
        const guestPass = "123456";
        setEmail(guestEmail);
        setPassword(guestPass);
        setLoading(true);

        const config = { headers: { "Content-type": "application/json" } };
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        try {
            let userData;
            try {
                const res = await axios.post(
                    `${backendUrl}/api/user/login`,
                    { email: guestEmail, password: guestPass },
                    config
                );
                userData = res.data;
            } catch (loginErr) {
                const regRes = await axios.post(
                    `${backendUrl}/api/user`,
                    {
                        name: "Guest User",
                        email: guestEmail,
                        password: guestPass,
                        pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    },
                    config
                );
                userData = regRes.data;
            }

            localStorage.setItem("userInfo", JSON.stringify(userData));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            const errMsg = error.response?.data?.message || "Server taking time to wake up (Render free tier). Please retry in 20 seconds!";
            alert(`Guest Login failed: ${errMsg}`);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex flex-col gap-4 w-full">
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm pointer-events-none">
                        ✉️
                    </span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 text-sm font-medium transition shadow-inner placeholder:text-slate-400"
                        placeholder="you@example.com"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm pointer-events-none">
                        🔒
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 text-sm font-medium transition shadow-inner placeholder:text-slate-400"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg disabled:opacity-50 mt-2 text-sm tracking-wide"
            >
                {loading ? "Signing In..." : "Sign In to Account"}
            </button>

            <div className="relative my-1 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                    or
                </span>
            </div>

            <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/20 hover:shadow-lg disabled:opacity-50 text-sm tracking-wide flex items-center justify-center gap-2"
            >
                <span>🚀</span>
                <span>{loading ? "Logging in..." : "1-Click Guest Login"}</span>
            </button>
        </form>
    );
};

export default Login;