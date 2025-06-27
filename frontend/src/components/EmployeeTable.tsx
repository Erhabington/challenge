"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { deleteEmployee } from "../store/slices/employeesSlice"
import { openModal, setSelectedEmployeeId, setFilters } from "../store/slices/uiSlice"

const EmployeeTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { employees, loading } = useSelector((state: RootState) => state.employees)
  const { filters } = useSelector((state: RootState) => state.ui)
  const { user } = useSelector((state: RootState) => state.auth)

  const handleEdit = (employeeId: string) => {
    dispatch(setSelectedEmployeeId(employeeId))
    dispatch(openModal("editEmployee"))
  }

  const handleDelete = async (employeeId: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(employeeId))
    }
  }

  const handleAddHoliday = (employeeId: string) => {
    dispatch(setSelectedEmployeeId(employeeId))
    dispatch(openModal("addHoliday"))
  }

  if (loading) {
    return (
      <div className="card">
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-48 rounded mx-auto mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-12 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        {/* Header Section with better spacing */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3 mb-8">
            <span className="text-2xl">👥</span>
            Employees ({employees.length})
          </h2>

          {/* Filters Section with more space */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-3">Department</label>
                <select
                  value={filters.dept}
                  onChange={(e) => dispatch(setFilters({ dept: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="resigned">Resigned</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section with better spacing */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Employee
              </th>
              <th
                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hourly Rate
              </th>
              <th
                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Days Off
              </th>
              {user?.role === "hr" && (
                <th style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr
                key={employee._id}
                className={`hover:bg-blue-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="text-sm font-medium text-gray-900 mb-1">{employee.name}</div>
                      <div style={{ marginBottom: "8px" }} className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {employee.dept}
                  </span>
                </td>
                <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">{employee.title}</td>
                <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">
                  <div className="text-center">
                    <span className="text-lg font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                      {employee.hourlyRate.currency} {employee.hourlyRate.amount}
                    </span>
                  </div>
                </td>
                <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">
                  <div className="text-center">
                    <span
                      className={`status-badge text-sm px-4 py-2 ${employee.status === "active" ? "status-active" : "status-resigned"}`}
                    >
                      {employee.status}
                    </span>
                  </div>
                </td>
                <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">
                  <div className="text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800">
                      {employee.holidays?.length || 0} days
                    </span>
                  </div>
                </td>
                {user?.role === "hr" && (
                  <td style={{ paddingLeft: "32px", paddingRight: "32px" }}
        className="py-8 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(employee._id)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 transition-all duration-200 px-3 py-2 rounded-md text-xs"
                        title="Edit Employee"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleAddHoliday(employee._id)}
                        className="text-green-600 hover:text-green-900 hover:bg-green-100 transition-all duration-200 px-3 py-2 rounded-md text-xs"
                        title="Add Holiday"
                      >
                        📅 Holiday
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-100 transition-all duration-200 px-3 py-2 rounded-md text-xs"
                        title="Delete Employee"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="text-center py-20">
            <span className="text-8xl text-gray-300 mb-8 block">👥</span>
            <h3 className="mt-6 text-lg font-medium text-gray-900">No employees found</h3>
            <p className="mt-3 text-sm text-gray-500">Get started by adding your first employee.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeTable
