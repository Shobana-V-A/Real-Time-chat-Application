const express = require('express');
const { registerUser, authUser, allUsers, updateUserProfile } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Here we chain the routes: POST is for registering, GET is for searching
router.route('/').post(registerUser).get(protect, allUsers);

// Route for login
router.post('/login', authUser);

// Route for profile update
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;