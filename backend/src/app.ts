import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth"
import employeeRoutes from "./routes/employees"
import holidayRoutes from "./routes/holidays"
import payrollRoutes from "./routes/payroll"
import { errorHandler } from "./middleware/errorHandler"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/payscope")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/holidays", holidayRoutes)
app.use("/api/payroll", payrollRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
