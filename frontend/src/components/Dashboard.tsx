"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { fetchEmployees } from "../store/slices/employeesSlice"
import { fetchPayrollSummary } from "../store/slices/payrollSlice"
import { openModal } from "../store/slices/uiSlice"
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

  const handleAddEmployee = () => {
    dispatch(openModal("addEmployee"))
    // Scroll to bottom when modal opens
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      })
    }, 100)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PayScope Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user.email} ({user.role})
                </p>
              </div>
            </div>
            {user?.role === "hr" && (
              <button onClick={handleAddEmployee} className="btn-primary">
                + Add Employee
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TopBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EmployeeTable />
            </div>
            <div className="space-y-6">
              <Charts />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EmployeeModal />
      <HolidayModal />
    </div>
  )
}

export default Dashboard
