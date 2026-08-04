import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const postDetails = (pics) => {
        if (!pics) return;
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/webp") {
            setPicLoading(true);

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
                            setPic(data.secure_url || data.url);
                        } else {
                            readAsBase64(pics);
                        }
                        setPicLoading(false);
                    })
                    .catch(() => {
                        readAsBase64(pics);
                    });
            } else {
                readAsBase64(pics);
            }
        } else {
            alert("Please select a valid image file (JPEG/PNG/WebP)");
        }
    };

    const readAsBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPic(reader.result);
            setPicLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmpassword) {
            alert("Please fill in all required fields");
            return;
        }

        if (password !== confirmpassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const config = { headers: { "Content-type": "application/json" } };
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

            const { data } = await axios.post(
                `${backendUrl}/api/user`,
                { name, email, password, pic },
                config
            );

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex flex-col gap-3.5 w-full">
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 text-sm font-medium transition shadow-inner placeholder:text-slate-400"
                    placeholder="Jane Doe"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 text-sm font-medium transition shadow-inner placeholder:text-slate-400"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 text-sm font-medium transition shadow-inner placeholder:text-slate-400"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Confirm
                    </label>
                    <input
                        type="password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 text-sm font-medium transition shadow-inner placeholder:text-slate-400"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Profile Picture (Optional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl p-1 bg-slate-50/80"
                />
                {picLoading && <p className="text-[11px] font-semibold text-blue-600 mt-1">Uploading avatar...</p>}
            </div>

            <button
                type="submit"
                disabled={loading || picLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg disabled:opacity-50 mt-1 text-sm tracking-wide"
            >
                {picLoading ? "Uploading Image..." : loading ? "Creating Account..." : "Create Free Account"}
            </button>
        </form>
    );
};

export default Signup;