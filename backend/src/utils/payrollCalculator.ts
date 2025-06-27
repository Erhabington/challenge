import type { IEmployee } from "../models/Employee"
import type { IHoliday } from "../models/Holiday"
import type mongoose from "mongoose"

// Simple currency conversion rates (in production, use a real API)
const CURRENCY_RATES: { [key: string]: number } = {
  USD: 1,
  EUR: 0.85,
  PKR: 280,
}

export function getBusinessDaysInMonth(year: number, month: number): number {
  const date = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0).getDate()
  let businessDays = 0

  for (let day = 1; day <= lastDay; day++) {
    date.setDate(day)
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday or Saturday
      businessDays++
    }
  }

  return businessDays
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = CURRENCY_RATES[fromCurrency] || 1
  const toRate = CURRENCY_RATES[toCurrency] || 1
  return (amount / fromRate) * toRate
}

export async function calculatePayrollSummary(
  employees: IEmployee[],
  holidays: IHoliday[],
  month: string,
  targetCurrency: string,
) {
  const [year, monthNum] = month.split("-").map(Number)
  const workDays = getBusinessDaysInMonth(year, monthNum)

  const byDept: { [key: string]: any } = {}
  let totalHeadCount = 0
  let totalBillableHours = 0
  let totalMonthlyCost = 0

  for (const employee of employees) {
    const dept = employee.dept

    // Calculate unpaid holiday days for this employee
    // Fix the type casting issue by properly converting ObjectId to string
    const employeeIdString = (employee._id as mongoose.Types.ObjectId).toString()
    const unpaidHolidays = holidays.filter(
      (h) => h.employeeId.toString() === employeeIdString && h.kind === "unpaid",
    ).length

    const billableHours = workDays * 8 - unpaidHolidays * 8
    const monthlyCost = convertCurrency(
      employee.hourlyRate.amount * billableHours,
      employee.hourlyRate.currency,
      targetCurrency,
    )

    if (!byDept[dept]) {
      byDept[dept] = {
        dept,
        headCount: 0,
        billableHours: 0,
        monthlyCost: 0,
      }
    }

    byDept[dept].headCount += 1
    byDept[dept].billableHours += billableHours
    byDept[dept].monthlyCost += monthlyCost

    totalHeadCount += 1
    totalBillableHours += billableHours
    totalMonthlyCost += monthlyCost
  }

  return {
    byDept: Object.values(byDept),
    totalHeadCount,
    totalBillableHours,
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
  }
}
