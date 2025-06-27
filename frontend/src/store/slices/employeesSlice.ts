import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export interface Employee {
  _id: string
  name: string
  email: string
  dept: string
  title: string
  status: "active" | "resigned"
  hourlyRate: { amount: number; currency: string }
  hireDate: string
  raises: Array<{ date: string; amount: number; currency: string }>
  holidays: Array<{ date: string; kind: "paid" | "unpaid" | "sick" }>
  createdAt: string
}

interface EmployeesState {
  employees: Employee[]
  loading: boolean
  error: string | null
}

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
}

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (filters: { dept?: string; status?: string } = {}, { getState }) => {
    const state = getState() as any
    const token = state.auth.token

    const params = new URLSearchParams()
    if (filters.dept) params.append("dept", filters.dept)
    if (filters.status) params.append("status", filters.status)

    const response = await axios.get(`${API_URL}/employees?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
)

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData: Partial<Employee>, { getState }) => {
    const state = getState() as any
    const token = state.auth.token

    const response = await axios.post(`${API_URL}/employees`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
)

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, updates }: { id: string; updates: Partial<Employee> }, { getState }) => {
    const state = getState() as any
    const token = state.auth.token

    const response = await axios.patch(`${API_URL}/employees/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
)

export const deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id: string, { getState }) => {
  const state = getState() as any
  const token = state.auth.token

  await axios.delete(`${API_URL}/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return id
})

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch employees"
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload)
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((emp) => emp._id === action.payload._id)
        if (index !== -1) {
          state.employees[index] = action.payload
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((emp) => emp._id !== action.payload)
      })
  },
})

export const { clearError } = employeesSlice.actions
export default employeesSlice.reducer
