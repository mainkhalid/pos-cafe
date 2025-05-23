
const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Enum for user roles
const ROLE = {
    GENERAL: "GENERAL",
    ADMIN: "ADMIN"
};

async function userSignUpController(req, res) {
    try {
        const { email, password, name, adminKey } = req.body;

        // Comprehensive input validation
        if (!email) {
            return res.status(400).json({
                message: "Please provide email",
                error: true,
                success: false
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                error: true,
                success: false
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Please provide password",
                error: true,
                success: false
            });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
                error: true,
                success: false
            });
        }

        if (!name) {
            return res.status(400).json({
                message: "Please provide name",
                error: true,
                success: false
            });
        }

        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                error: true,
                success: false
            });
        }

        // Determine user role
        let userRole = ROLE.GENERAL;

        // Admin role registration
        const ADMIN_REGISTRATION_KEY = process.env.ADMIN_REGISTRATION_KEY;
        
        // Check if admin registration key is provided and matches
        if (adminKey) {
            if (!ADMIN_REGISTRATION_KEY) {
                return res.status(500).json({
                    message: "Admin registration is not configured",
                    error: true,
                    success: false
                });
            }

            if (adminKey !== ADMIN_REGISTRATION_KEY) {
                return res.status(403).json({
                    message: "Invalid admin registration key",
                    error: true,
                    success: false
                });
            }

            // Set role to ADMIN if key is correct
            userRole = ROLE.ADMIN;
        }

        // Password hashing
        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Create user payload
        const payload = {
            email: email.toLowerCase(),
            password: hashPassword,
            name: name.trim(),
            role: userRole // Dynamically set role based on admin key
        };

        // Create and save new user
        const userData = new userModel(payload);
        const saveUser = await userData.save();

        // Remove sensitive information before sending response
        const { password: removedPassword, ...userResponse } = saveUser.toObject();

        res.status(201).json({
            data: userResponse,
            success: true,
            error: false,
            message: `${userRole} User created Successfully!`
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: err.message || "Signup failed",
            error: true,
            success: false
        });
    }
}

module.exports = userSignUpController;
module.exports.ROLE = ROLE;