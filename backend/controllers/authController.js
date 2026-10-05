const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Check whether an email is already registered
// @route   GET /api/auth/check-email
// @access  Public
const checkEmail = async (req, res) => {
    try {
        const email = String(req.query.email || '').trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const userExists = await User.exists({ email });
        res.json({ exists: Boolean(userExists) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, gender, dob, password, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone: phone || '',
            gender: gender || '',
            dob: dob || '',
            password,
            role: role || 'tenant',
        });

        res.status(201).json({
            _id: user._id,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            roles: user.roles,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        await user.save();

        res.json({
            _id: user._id,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            roles: user.roles,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Social Login / Signup
// @route   POST /api/auth/social-login
// @access  Public
const socialLogin = async (req, res) => {
    try {
        const { provider, accessToken } = req.body;
        let email, firstName, lastName;

        if (provider === 'google') {
            const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            email = data.email;
            firstName = data.given_name;
            lastName = data.family_name;
        } else {
            return res.status(400).json({ message: 'Invalid social provider' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email could not be retrieved from provider' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            // Auto-signup
            user = await User.create({
                firstName: firstName || 'User',
                lastName: lastName || '',
                email,
                phone: '',
                gender: '',
                dob: '',
                password: Date.now().toString() + Math.random().toString(36).substring(7), // Random password
                role: 'tenant', 
            });
        }

        res.json({
            _id: user._id,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            roles: user.roles,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Social Auth Error:", error);
        res.status(500).json({ message: 'Social authentication failed: ' + error.message });
    }
};

module.exports = { checkEmail, register, login, socialLogin };
