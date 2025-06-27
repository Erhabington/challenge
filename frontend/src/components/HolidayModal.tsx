"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { closeModal } from "../store/slices/uiSlice"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const HolidayModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { modals, selectedEmployeeId } = useSelector((state: RootState) => state.ui)
  const { token } = useSelector((state: RootState) => state.auth)
  const { employees } = useSelector((state: RootState) => state.employees)

  const isOpen = modals.addHoliday
  const selectedEmployee = employees.find((emp) => emp._id === selectedEmployeeId)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    kind: "paid" as "paid" | "unpaid" | "sick",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.post(
        `${API_URL}/holidays`,
        {
          employeeId: selectedEmployeeId,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      dispatch(closeModal("addHoliday"))
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error("Failed to add holiday:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    dispatch(closeModal("addHoliday"))
  }

  if (!isOpen) return null

  const holidayTypes = [
    { value: "paid", label: "Paid Leave", icon: "💰", color: "text-green-600" },
    { value: "unpaid", label: "Unpaid Leave", icon: "📅", color: "text-orange-600" },
    { value: "sick", label: "Sick Leave", icon: "🏥", color: "text-red-600" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span>📅</span>
            Add Holiday
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="p-6">
          {selectedEmployee && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {selectedEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.dept} • {selectedEmployee.title}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Holiday Type</label>
              <div className="space-y-2">
                {holidayTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.kind === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kind"
                      value={type.value}
                      checked={formData.kind === type.value}
                      onChange={(e) => setFormData({ ...formData, kind: e.target.value as "paid" | "unpaid" | "sick" })}
                      className="sr-only"
                    />
                    <span className="text-lg mr-3">{type.icon}</span>
                    <span className={`font-medium ${type.color}`}>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button type="button" onClick={handleClose} className="btn-secondary" disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span>⏳</span>
                    Adding...
                  </>
                ) : (
                  "Add Holiday"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HolidayModal
