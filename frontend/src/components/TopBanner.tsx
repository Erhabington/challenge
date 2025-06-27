"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { setCurrency, setMonth } from "../store/slices/uiSlice"

const TopBanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { summary, loading } = useSelector((state: RootState) => state.payroll)
  const { selectedCurrency, selectedMonth } = useSelector((state: RootState) => state.ui)
  

  const currencies = ["USD", "EUR", "PKR"]

  

  return (
    <div className="mb-8">
      {/* Metrics Cards */}
      <div style={{ marginTop: "1rem" }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="metric-card group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  summary?.totalHeadCount || 0
                )}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
              <span className="text-white font-bold text-lg">👥</span>
            </div>
          </div>
        </div>

        <div className="metric-card group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Billable Hours</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  summary?.totalBillableHours || 0
                )}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors duration-300">
              <span className="text-white font-bold text-lg">⏰</span>
            </div>
          </div>
        </div>

        <div className="metric-card group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Monthly Burn</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                ) : (
                  `${selectedCurrency} ${summary?.totalMonthlyCost?.toLocaleString() || 0}`
                )}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors duration-300">
              <span className="text-white font-bold text-lg">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => dispatch(setMonth(e.target.value))}
                  className="input-field min-w-[200px]"
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
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => dispatch(setCurrency(e.target.value))}
                  className="input-field min-w-[120px]"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBanner
