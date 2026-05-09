import React, { useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Fatura from './pages/Fatura'
import Conta from './pages/Conta'
import Revisar from './pages/Revisar'
import Mobile from './pages/Mobile'
import Config from './pages/Config'
import Relatorios from './pages/Relatorios'
import Historico from './pages/Historico'
import Onboarding from './pages/Onboarding'
import './App.css'

function AppContent() {
  const location = useLocation()
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('onboardingDone'))
  const isMobile = location.pathname === '/mobile'

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className={`app ${isMobile ? 'mobile' : 'desktop'}`}>
      {!isMobile && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/fatura" replace />} />
          <Route path="/fatura" element={<Fatura />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="/revisar" element={<Revisar />} />
          <Route path="/config" element={<Config />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/historico" element={<Historico />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
