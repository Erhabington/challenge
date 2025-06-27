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
    return <div className="text-center py-8">Loading employees...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Employees</h2>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <select
            value={filters.dept}
            onChange={(e) => dispatch(setFilters({ dept: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="resigned">Resigned</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hourly Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days Off
              </th>
              {user?.role === "hr" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.dept}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.hourlyRate.currency} {employee.hourlyRate.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.holidays?.length || 0}</td>
                {user?.role === "hr" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(employee._id)} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button
                      onClick={() => handleAddHoliday(employee._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Holiday
                    </button>
                    <button onClick={() => handleDelete(employee._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeTable
