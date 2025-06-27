import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const Charts: React.FC = () => {
  const { summary, loading } = useSelector((state: RootState) => state.payroll)
  const { selectedCurrency } = useSelector((state: RootState) => state.ui)

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="card">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="bg-gray-200 h-6 w-48 rounded mb-4"></div>
                <div className="bg-gray-200 h-64 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <span className="text-6xl text-gray-400 mb-4 block">📊</span>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Charts will appear when data is loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Monthly Burn Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>📊</span>
            Monthly Burn by Department
          </h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.byDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                formatter={(value) => [`${selectedCurrency} ${value}`, "Monthly Cost"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="monthlyCost" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Billable Hours Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>⏰</span>
            Billable Hours by Department
          </h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary.byDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                formatter={(value) => [`${value} hours`, "Billable Hours"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="billableHours"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>🥧</span>
            Team Distribution
          </h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summary.byDept}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="headCount"
                label={({ dept, headCount }) => `${dept}: ${headCount}`}
              >
                {summary.byDept.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Charts
