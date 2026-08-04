import { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";

const ProfileModal = ({ user: displayUser, isOpen, onClose, isEditable = false }) => {
    const { user: currentUser, setUser: setCurrentUser } = ChatState();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [customStatus, setCustomStatus] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (displayUser) {
            setName(displayUser.name || "");
            setPic(displayUser.pic || "");
            setCustomStatus(displayUser.customStatus || "");
        }
    }, [displayUser, isOpen]);

    if (!isOpen || !displayUser) return null;

    const readAsBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPic(reader.result);
            setImageLoading(false);
        };
        reader.onerror = () => {
            alert("Failed to process image file.");
            setImageLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = (file) => {
        if (!file) return;
        if (file.type.startsWith("image/")) {
            setImageLoading(true);
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            // If Cloudinary keys are present, attempt Cloudinary upload
            if (cloudName && uploadPreset) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", uploadPreset);
                data.append("cloud_name", cloudName);

                fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: data,
                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Cloudinary upload failed");
                        return res.json();
                    })
                    .then((data) => {
                        if (data.secure_url || data.url) {
                            setPic(data.secure_url || data.url);
                        } else {
                            readAsBase64(file);
                        }
                        setImageLoading(false);
                    })
                    .catch((err) => {
                        console.warn("Cloudinary upload failed, falling back to local image data:", err);
                        readAsBase64(file);
                    });
            } else {
                // If Cloudinary env vars are not set, convert image to data URL directly
                readAsBase64(file);
            }
        } else {
            alert("Please select a valid image file (JPEG, PNG, WebP)");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };

            const payload = { name, pic, customStatus };
            if (password) payload.password = password;

            const { data } = await axios.put(
                `${backendUrl}/api/user/profile`,
                payload,
                config
            );

            alert("Profile updated successfully!");
            // Update local storage and chat state
            localStorage.setItem("userInfo", JSON.stringify(data));
            setCurrentUser(data);
            setLoading(false);
            setIsEditing(false);
        } catch (error) {
            console.error("Profile update error:", error);
            const serverMsg = error.response?.data?.message;
            const status = error.response?.status;
            let displayMsg = "Failed to update profile";

            if (status === 404) {
                displayMsg = "Profile update route not found on the active backend server. Please make sure your updated backend is running locally or redeployed to Render!";
            } else if (status === 413) {
                displayMsg = "Image payload is too large. Please select a smaller image or paste an image URL!";
            } else if (serverMsg) {
                displayMsg = serverMsg;
            }

            alert(displayMsg);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative transition-all">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white p-5 flex justify-between items-center shadow-sm">
                    <h2 className="text-xl font-bold tracking-wide">
                        {isEditing ? "✏️ Edit Profile" : "👤 User Details"}
                    </h2>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            onClose();
                        }}
                        className="text-white/80 hover:text-white font-bold text-2xl leading-none transition"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center">
                    {/* Profile Picture Display */}
                    <div className="relative mb-4 group">
                        <img
                            src={pic || displayUser.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                            alt={displayUser.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/30 shadow-lg ring-4 ring-white/50"
                        />
                        {imageLoading && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                Uploading...
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        /* Read-only view */
                        <div className="w-full text-center space-y-3">
                            <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                                {displayUser.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-600 bg-white/60 py-1.5 px-4 rounded-full inline-block border border-gray-200 shadow-sm">
                                ✉️ {displayUser.email}
                            </p>

                            {displayUser.customStatus && (
                                <div className="mt-2 text-sm italic text-gray-700 bg-blue-50/80 p-2.5 rounded-lg border border-blue-100 shadow-inner">
                                    "{displayUser.customStatus}"
                                </div>
                            )}

                            <div className="pt-2 flex justify-center gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                                    {displayUser.role || "User"}
                                </span>
                            </div>

                            {/* Edit Profile button if logged-in user */}
                            {isEditable && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-md hover:shadow-lg"
                                >
                                    ✏️ Edit Profile Details
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Edit view */
                        <form onSubmit={handleUpdateProfile} className="w-full space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm shadow-inner"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e.target.files[0])}
                                    className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg p-1"
                                />
                                <span className="text-[11px] text-gray-500 block mt-1">Or paste image URL:</span>
                                <input
                                    type="text"
                                    value={pic}
                                    onChange={(e) => setPic(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-xs shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Status Message
                                </label>
                                <input
                                    type="text"
                                    value={customStatus}
                                    onChange={(e) => setCustomStatus(e.target.value)}
                                    placeholder="Available, coding, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    New Password (optional)
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep unchanged"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm shadow-inner"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-xl transition text-sm shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || imageLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition text-sm shadow-md disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-100/60 p-3 text-center border-t border-gray-200/50">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            onClose();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
