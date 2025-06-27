import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import employeesSlice from "./slices/employeesSlice"
import payrollSlice from "./slices/payrollSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeesSlice,
    payroll: payrollSlice,
    ui: uiSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
