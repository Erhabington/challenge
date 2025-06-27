"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { createEmployee, updateEmployee } from "../store/slices/employeesSlice"
import { closeModal } from "../store/slices/uiSlice"

const EmployeeModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { modals, selectedEmployeeId } = useSelector((state: RootState) => state.ui)
  const { employees } = useSelector((state: RootState) => state.employees)

  const isOpen = modals.addEmployee || modals.editEmployee
  const isEdit = modals.editEmployee
  const selectedEmployee = employees.find((emp) => emp._id === selectedEmployeeId)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dept: "",
    title: "",
    status: "active" as "active" | "resigned",
    hourlyRate: { amount: 0, currency: "USD" },
    hireDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (isEdit && selectedEmployee) {
      setFormData({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        dept: selectedEmployee.dept,
        title: selectedEmployee.title,
        status: selectedEmployee.status,
        hourlyRate: selectedEmployee.hourlyRate,
        hireDate: selectedEmployee.hireDate.split("T")[0],
      })
    } else {
      setFormData({
        name: "",
        email: "",
        dept: "",
        title: "",
        status: "active",
        hourlyRate: { amount: 0, currency: "USD" },
        hireDate: new Date().toISOString().split("T")[0],
      })
    }
  }, [isEdit, selectedEmployee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && selectedEmployeeId) {
      dispatch(updateEmployee({ id: selectedEmployeeId, updates: formData }))
    } else {
      dispatch(createEmployee(formData))
    }

    dispatch(closeModal(isEdit ? "editEmployee" : "addEmployee"))
  }

  const handleClose = () => {
    dispatch(closeModal(isEdit ? "editEmployee" : "addEmployee"))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit Employee" : "Add Employee"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={formData.dept}
              onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourlyRate: { ...formData.hourlyRate, amount: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.hourlyRate.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourlyRate: { ...formData.hourlyRate, currency: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="PKR">PKR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "resigned" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="resigned">Resigned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
            <input
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeModal
