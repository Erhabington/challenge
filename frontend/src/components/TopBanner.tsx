"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { setCurrency, setMonth, openModal } from "../store/slices/uiSlice"
import { logout } from "../store/slices/authSlice"

const TopBanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { summary } = useSelector((state: RootState) => state.payroll)
  const { selectedCurrency, selectedMonth } = useSelector((state: RootState) => state.ui)
  const { user } = useSelector((state: RootState) => state.auth)

  const currencies = ["USD", "EUR", "PKR"]

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary?.totalHeadCount || 0}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary?.totalBillableHours || 0}</div>
            <div className="text-sm text-gray-600">Billable Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {selectedCurrency} {summary?.totalMonthlyCost?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Monthly Burn</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => dispatch(setMonth(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date()
              date.setMonth(i)
              const value = `${date.getFullYear()}-${String(i + 1).padStart(2, "0")}`
              return (
                <option key={value} value={value}>
                  {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </option>
              )
            })}
          </select>

          <select
            value={selectedCurrency}
            onChange={(e) => dispatch(setCurrency(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          {user?.role === "hr" && (
            <button
              onClick={() => dispatch(openModal("addEmployee"))}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Employee
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBanner
