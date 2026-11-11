const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/users");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// A token is a signed ID card: the client sends it back to prove it logged in.
function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// POST /api/auth/register
// Save a new user in MongoDB. Hash the password first so the real password
// is never stored in the database.
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};

  if (    
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "First name, last name, email, and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token: createToken(user.id),
    });
  } catch (error) {
    // MongoDB's unique email index also prevents duplicates if two requests
    // try to register the same address at almost the same time.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    console.error("User registration failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
});

// POST /api/auth/login
// Find the account, compare the submitted password with its saved hash,
// then issue a token if both credentials match.
async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Password is hidden by default in the User model, so request it for this
    // comparison only.
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const passwordMatches = user && await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token: createToken(user.id),
    });
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to log in",
    });
  }
}

// Keep the old /login URL as well as the new /api/auth/login URL.
router.post("/login", login);
router.post("/", login);

// GET /api/auth/me
// authenticate checks the token first. Its user ID is then used to load
// this person's safe (password-free) profile from MongoDB.
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.authUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user profile",
    });
  }
});

module.exports = router;
