import bcryptPkg from "bcryptjs";
import jwtPkg from "jsonwebtoken";
import User from "../models/User.js";
import { validateEmail, validatePassword } from "../utils/validators.js";

const { hash, compare } = bcryptPkg;
const { sign } = jwtPkg;

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!validatePassword(password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include a number and a special character",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const token = sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export default { signup, login };