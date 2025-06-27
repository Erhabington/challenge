import express, { type Response } from "express"
import Employee from "../models/Employee"
import Holiday from "../models/Holiday"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { calculatePayrollSummary } from "../utils/payrollCalculator"

const router = express.Router()

// GET /api/payroll/summary
router.get("/summary", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { month, currency = "USD" } = req.query

    if (!month || typeof month !== "string") {
      res.status(400).json({ message: "Month parameter required (format: YYYY-MM)" })
      return
    }

    const employees = await Employee.find({ status: "active" })
    const holidays = await Holiday.find({
      date: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(new Date(`${month}-01`).getFullYear(), new Date(`${month}-01`).getMonth() + 1, 1),
      },
    })

    const summary = await calculatePayrollSummary(employees, holidays, month, currency as string)
    res.json(summary)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
})

export default router
