import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

interface PayrollSummary {
  byDept: Array<{
    dept: string
    headCount: number
    billableHours: number
    monthlyCost: number
  }>
  totalHeadCount: number
  totalBillableHours: number
  totalMonthlyCost: number
}

interface PayrollState {
  summary: PayrollSummary | null
  loading: boolean
  error: string | null
}

const initialState: PayrollState = {
  summary: null,
  loading: false,
  error: null,
}

export const fetchPayrollSummary = createAsyncThunk(
  "payroll/fetchSummary",
  async ({ month, currency }: { month: string; currency: string }, { getState }) => {
    const state = getState() as any
    const token = state.auth.token

    const response = await axios.get(`${API_URL}/payroll/summary`, {
      params: { month, currency },
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
)

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayrollSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchPayrollSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch payroll summary"
      })
  },
})

export const { clearError } = payrollSlice.actions
export default payrollSlice.reducer
