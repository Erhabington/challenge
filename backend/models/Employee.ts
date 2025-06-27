import mongoose, { Schema, Document } from 'mongoose';

interface HourlyRate {
  amount: number;
  currency: string;
}

interface Raise {
  date: Date;
  amount: number;
  currency: string;
}

interface Holiday {
  date: Date;
  kind: 'paid' | 'unpaid' | 'sick';
}

export interface IEmployee extends Document {
  name: string;
  email: string;
  dept: string;
  title: string;
  status: 'active' | 'resigned';
  hourlyRate: HourlyRate;
  hireDate: Date;
  raises: Raise[];
  holidays: Holiday[];
  createdAt: Date;
}

const EmployeeSchema: Schema = new Schema<IEmployee>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dept: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['active', 'resigned'], default: 'active' },
  hourlyRate: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
  },
  hireDate: { type: Date, required: true },
  raises: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true },
    },
  ],
  holidays: [
    {
      date: { type: Date, required: true },
      kind: { type: String, enum: ['paid', 'unpaid', 'sick'], required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
