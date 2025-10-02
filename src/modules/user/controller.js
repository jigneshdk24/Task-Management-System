const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../../models");

const JWT_SECRET = process.env.JWT_SECRET;

// register
const register = async (req, res) => {
  const { name, email, contact, password, is_admin = 0 } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      contact,
      password: hashedPassword,
      is_admin,
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// login
const login = async (req, res) => {
  const { email, password: payloadPassword } = req.body;
  try {
    const existingUser = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "password",
        "contact",
        "created_at",
        "updated_at",
        "is_admin",
        "is_first_login",
      ],
    });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = existingUser.password;
    const isPasswordValid = await bcrypt.compare(payloadPassword, hashedPassword);
    console.log(isPasswordValid, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      if (!JWT_SECRET) {
        return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
      }

      // Flip first login flag on first successful login
      if (existingUser.is_first_login === 1) {
        existingUser.is_first_login = 0;
        await existingUser.save();
      }
      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser.id,
          is_admin: existingUser.is_admin,
        },
        JWT_SECRET,
        { expiresIn: "10d" }
      );
      res.status(200).json({
        message: "Login successfully",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          contact: existingUser.contact,
          is_admin: existingUser.is_admin,
          createdAt: existingUser.created_at,
        },
        token,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    if (user.is_first_login === 1) {
      user.is_first_login = 0;
    }
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });
    console.log("Reset token:", resetToken);
    return res
      .status(200)
      .json({ message: "Reset token generated", resetToken });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const payload = jwt.verify(resetToken, JWT_SECRET);
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};


