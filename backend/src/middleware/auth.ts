import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: "hr" | "viewer"
  }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    res.status(401).json({ message: "Access token required" })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback-secret", (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" })
      return
    }
    req.user = user as { id: string; role: "hr" | "viewer" }
    next()
  })
}

export const requireHR = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "hr") {
    res.status(403).json({ message: "HR role required" })
    return
  }
  next()
}
