const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;

// register
const register = async (req, res) => {
  const { name, email, contact, password } = req.body;
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
      ],
    });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password } = existingUser;
    const isPasswordValid = await bcrypt.compare(payloadPassword, password);
    console.log(isPasswordValid, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser.id,
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
          createdAt: existingUser.created_at,
        },
        token,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, login };
