import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  selectedCurrency: string
  selectedMonth: string
  filters: {
    dept: string
    status: string
  }
  modals: {
    addEmployee: boolean
    editEmployee: boolean
    addHoliday: boolean
  }
  selectedEmployeeId: string | null
}

const currentDate = new Date()
const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`

const initialState: UiState = {
  selectedCurrency: "USD",
  selectedMonth: currentMonth,
  filters: {
    dept: "",
    status: "",
  },
  modals: {
    addEmployee: false,
    editEmployee: false,
    addHoliday: false,
  },
  selectedEmployeeId: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.selectedCurrency = action.payload
    },
    setMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<UiState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    openModal: (state, action: PayloadAction<keyof UiState["modals"]>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<keyof UiState["modals"]>) => {
      state.modals[action.payload] = false
    },
    setSelectedEmployeeId: (state, action: PayloadAction<string | null>) => {
      state.selectedEmployeeId = action.payload
    },
    resetUI: (state) => {
    state.modals = {
    addEmployee: false,
    editEmployee: false,
    addHoliday: false,
    }
    state.selectedEmployeeId = null
    }
  },
})

export const { setCurrency, setMonth, setFilters, openModal, closeModal, setSelectedEmployeeId, resetUI, } = uiSlice.actions
export default uiSlice.reducer
