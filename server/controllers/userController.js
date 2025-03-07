const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.phone)
    return res.json({ message: "All are compulsory" }).status(400);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    role: req.body.role,
  });

  try {
    const newUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        phone: newUser.phone,
      },
      process.env.ACCESS_TOKEN_SECRET, // Use environment variable in production
      { expiresIn: "24h" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json({
      user: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
