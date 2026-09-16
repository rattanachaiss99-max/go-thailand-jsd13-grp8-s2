import { Router } from "express";
import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../../middlewares/authUser.js"


export const router = Router();

// Read users
router.get("/", async (req, res, next) => {
  try {
    // 1. Get users data from database
    const users = await User.find();
    // 2. Send response object back to client
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

// Create user
router.post("/", async (req, res, next) => {
  try {
    const { username, role, email, password } = req.body;

    if (!username || !role || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required." });
    }

    const newUser = await User.create({ username, role, email, password });

    const { password: _password, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
});

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.json(deletedUser);
  } catch (err) {
    next(err);
  }
});

// Login user

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required!" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Incorrect password!" });
    }
    console.log(isMatch);
    console.log(process.env.JWT_SECRET);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "1h", });
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, { 
      httpOnly: true, 
      secure: isProd, 
      sameSite: isProd ? "none" : "lax", path: "/", 
      maxAge: 60 * 60 * 1000 
    }); // 1 hour in milliseconds
    
    return res.status(200).json({ 
      success: true, 
      message: "Login successful!",
      user: { id: user._id, 
        username: user.username, 
        role: user.role,
        email: user.email, 
       },
    });
  } catch (err) {
    next(err);
  }
});

// Logout user
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("accessToken", { 
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/" });
  return res.status(200).json({  
    success: true, 
    message: "Logout successful!" });
});



// Check user's token
router.get("/auth", authUser, async(req, res, next) => {
  try {
    const userId = req.user.user._id
    const user = await User.findById(userId);

    if(!user)
    {
      return res.status(401).json({success : false, message : "User not found!"});
    }
    return res.status(200).json({
      success : true, 
      id : user._id, 
      username : user.username, 
      email : user.email, 
      role : user.role});
  }
  catch(err)
  {next(err)}
} );
