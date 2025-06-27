import type React from "react"
import { Provider } from "react-redux"
import { useSelector } from "react-redux"
import { store, type RootState } from "./store/store"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import "./index.css"

const AppContent: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return user ? <Dashboard /> : <Login />
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
