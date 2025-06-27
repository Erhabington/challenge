import express, { type Response } from "express"
import Holiday from "../models/Holiday"
import { authenticateToken, requireHR, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// POST /api/holidays - Add holiday (HR only)
router.post("/", authenticateToken, requireHR, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const holiday = new Holiday(req.body)
    await holiday.save()
    res.status(201).json(holiday)
  } catch (error) {
    res.status(400).json({ message: "Validation error", error })
  }
})

// DELETE /api/holidays/:id - Delete holiday (HR only)
router.delete("/:id", authenticateToken, requireHR, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id)
    if (!holiday) {
      res.status(404).json({ message: "Holiday not found" })
      return
    }
    res.json({ message: "Holiday deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// GET /api/holidays - Get holidays for an employee
router.get("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.query
    const filter = employeeId ? { employeeId } : {}

    const holidays = await Holiday.find(filter).populate("employeeId", "name")
    res.json(holidays)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
