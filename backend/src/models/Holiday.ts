import mongoose, { Schema, type Document } from "mongoose"

export interface IHoliday extends Document {
  employeeId: mongoose.Types.ObjectId
  date: Date
  kind: "paid" | "unpaid" | "sick"
  createdAt: Date
}

const HolidaySchema: Schema = new Schema<IHoliday>({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  kind: { type: String, enum: ["paid", "unpaid", "sick"], required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IHoliday>("Holiday", HolidaySchema)
