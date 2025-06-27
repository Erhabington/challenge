import express, { type Request, type Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

const router = express.Router()

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "24h",
    })

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: "User already exists" })
      return
    }

    const user = new User({ email, password, role })
    await user.save()

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "24h",
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
