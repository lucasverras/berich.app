import React, { useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Fatura from './pages/Fatura'
import Conta from './pages/Conta'
import Saldo from './pages/Saldo'
import Cartao from './pages/Cartao'
import Investimentos from './pages/Investimentos'
import Itau from './pages/Itau'
import NuBank from './pages/NuBank'
import VamoNessa from "./pages/VamoNessa"
import InvestimentoDetalhe from './pages/InvestimentoDetalhe'
import BancoDetalhe from './pages/BancoDetalhe'
import Revisar from './pages/Revisar'
import Mobile from './pages/Mobile'
import Config from './pages/Config'
import Relatorios from './pages/Relatorios'
import Historico from './pages/Historico'
import Debug from "./pages/Debug"
import Planilha from './pages/Planilha'
import Onboarding from './pages/Onboarding'
import { ShadcnDemo } from './components/ShadcnDemo'
import './App.css'

function AppContent() {
  const location = useLocation()
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('onboardingDone'))
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768)
  const isMobile = windowWidth < 768

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', isMobile ? '0px' : '160px')
  }, [isMobile])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className={`dark app ${isMobile ? 'mobile' : 'desktop'}`}>
      {!isMobile && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/saldo" element={<Saldo />} />
          <Route path="/fatura" element={<Fatura />} />
          <Route path="/cartao" element={<Cartao />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="/investimentos" element={<Investimentos />} />
          <Route path="/investimentos/:id" element={<InvestimentoDetalhe />} />
          <Route path="/itau" element={<Itau />} />
          <Route path="/nubank" element={<NuBank />} />
          <Route path="/vamonessa" element={<VamoNessa />} />
          <Route path="/banco/:banco" element={<BancoDetalhe />} />
          <Route path="/revisar" element={<Revisar />} />
          <Route path="/config" element={<Config />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/planilha" element={<Planilha />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </main>
      {isMobile && <BottomNav />}
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
