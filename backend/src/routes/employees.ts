import express, { type Response } from "express"
import Employee from "../models/Employee"
import { authenticateToken, requireHR, type AuthRequest } from "../middleware/auth"

const router = express.Router()

// GET /api/employees - List employees with filters
router.get("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dept, status } = req.query
    const filter: any = {}

    if (dept) filter.dept = dept
    if (status) filter.status = status

    const employees = await Employee.aggregate([
  { $match: filter },
  {
    $lookup: {
      from: "holidays",            // your MongoDB collection name (usually lowercase)
      localField: "_id",           // field in Employee model
      foreignField: "employeeId",  // field in Holiday model
      as: "holidays"               // result field (you already use this in frontend)
    }
  },
  { $sort: { createdAt: -1 } }
])

    res.json(employees)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// POST /api/employees - Create employee (HR only)
router.post("/", authenticateToken, requireHR, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = new Employee(req.body)
    await employee.save()
    res.status(201).json(employee)
  } catch (error) {
    res.status(400).json({ message: "Validation error", error })
  }
})

// PATCH /api/employees/:id - Update employee (HR only)
router.patch("/:id", authenticateToken, requireHR, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updates = req.body

    // If updating hourly rate and it's higher, add to raises
    if (updates.hourlyRate) {
      const employee = await Employee.findById(id)
      if (employee && updates.hourlyRate.amount > employee.hourlyRate.amount) {
        updates.$push = {
          raises: {
            date: new Date(),
            amount: updates.hourlyRate.amount,
            currency: updates.hourlyRate.currency,
          },
        }
      }
    }

    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true })
    if (!employee) {
      res.status(404).json({ message: "Employee not found" })
      return
    }

    res.json(employee)
  } catch (error) {
    res.status(400).json({ message: "Update failed", error })
  }
})

// DELETE /api/employees/:id - Delete employee (HR only)
router.delete("/:id", authenticateToken, requireHR, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)
    if (!employee) {
      res.status(404).json({ message: "Employee not found" })
      return
    }
    res.json({ message: "Employee deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router
