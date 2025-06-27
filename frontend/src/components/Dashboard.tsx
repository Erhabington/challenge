"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { fetchEmployees } from "../store/slices/employeesSlice"
import { fetchPayrollSummary } from "../store/slices/payrollSlice"
import TopBanner from "./TopBanner"
import EmployeeTable from "./EmployeeTable"
import Charts from "./Charts"
import EmployeeModal from "./EmployeeModal"
import HolidayModal from "./HolidayModal"

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedCurrency, selectedMonth, filters } = useSelector((state: RootState) => state.ui)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchEmployees(filters))
    dispatch(fetchPayrollSummary({ month: selectedMonth, currency: selectedCurrency }))
  }, [dispatch, filters, selectedMonth, selectedCurrency])

  if (!user) {
    return <div>Please log in to access the dashboard.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PayScope Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user.email} ({user.role})
          </p>
        </div>

        <TopBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <EmployeeTable />
          </div>
          <div>
            <Charts />
          </div>
        </div>

        <EmployeeModal />
        <HolidayModal />
      </div>
    </div>
  )
}

export default Dashboard
