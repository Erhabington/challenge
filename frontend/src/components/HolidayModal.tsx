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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    }
  }

  const handleClose = () => {
    dispatch(closeModal("addHoliday"))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Add Holiday for {selectedEmployee?.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.kind}
              onChange={(e) => setFormData({ ...formData, kind: e.target.value as "paid" | "unpaid" | "sick" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="sick">Sick</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HolidayModal
