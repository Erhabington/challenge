import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const Charts: React.FC = () => {
  const { summary } = useSelector((state: RootState) => state.payroll)
  const { selectedCurrency } = useSelector((state: RootState) => state.ui)

  if (!summary) {
    return <div className="text-center py-8">Loading charts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Burn by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.byDept}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dept" />
            <YAxis />
            <Tooltip formatter={(value) => [`${selectedCurrency} ${value}`, "Monthly Cost"]} />
            <Bar dataKey="monthlyCost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billable Hours by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={summary.byDept}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dept" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} hours`, "Billable Hours"]} />
            <Line type="monotone" dataKey="billableHours" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Charts
