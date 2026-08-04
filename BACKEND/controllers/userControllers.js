const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

// @description    Register a new user
// @route          POST /api/user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    // 1. Check if all fields are provided
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all required fields");
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // 3. Create the user in the database
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    // 4. If successful, send back user data + token
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
});

// @description    Authenticate user & get token (Login)
// @route          POST /api/user/login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    // Auto-create or repair Guest User if email is guest@example.com
    if (email === "guest@example.com") {
        if (!user) {
            user = await User.create({
                name: "Guest User",
                email: "guest@example.com",
                password: password || "123456",
                pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            });
        } else {
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                user.password = password || "123456";
                await user.save();
            }
        }
    }

    // If user exists AND the password matches
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            role: user.role,
            customStatus: user.customStatus || "",
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @description    Get or Search all users
// @route          GET /api/user?search=
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    // Find users matching the keyword, but do NOT include the currently logged-in user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

// @description    Update user profile
// @route          PUT /api/user/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.pic) {
            user.pic = req.body.pic;
        }
        if (req.body.customStatus !== undefined) {
            user.customStatus = req.body.customStatus;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            role: updatedUser.role,
            customStatus: updatedUser.customStatus || "",
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = { registerUser, authUser, allUsers, updateUserProfile };