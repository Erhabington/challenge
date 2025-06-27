import type { Request, Response, NextFunction } from "express"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(error.stack)

  if (error.name === "ValidationError") {
    res.status(400).json({
      message: "Validation Error",
      errors: Object.values(error.errors).map((err: any) => err.message),
    })
    return
  }

  if (error.name === "CastError") {
    res.status(400).json({ message: "Invalid ID format" })
    return
  }

  res.status(500).json({ message: "Internal server error" })
}
