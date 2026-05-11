import React, { useState } from 'react'
import Icons from '../components/Icons'
import './Onboarding.css'

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      localStorage.setItem('userName', name || 'User')
      localStorage.setItem('onboardingDone', 'true')
      onComplete()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboardingDone', 'true')
    onComplete()
  }

  return (
    <div className="onboarding">
      <div className="onboarding-background" />

      {step === 0 && (
        <div className="onboarding-card">
          <div className="onboarding-hero">
            <Icons.DollarSign size={64} style={{ color: 'var(--primary-light)' }} />
          </div>
          <h1>BE.RICH</h1>
          <p className="tagline">Organização Financeira = Liberdade</p>
          <p className="description">
            Controle seus gastos inteligentemente, automatize suas categorias e tome decisões financeiras com confiança.
          </p>
          <div className="onboarding-actions">
            <button onClick={handleNext}>Continuar</button>
            <button onClick={handleSkip} className="secondary">Pular</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="onboarding-card">
          <div className="onboarding-content">
            <Icons.CheckCircle size={48} style={{ color: 'var(--primary-light)' }} />
            <h2>Bem-vindo!</h2>
            <p>Como você gostaria de ser chamado?</p>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="onboarding-actions">
            <button onClick={handleNext}>Próximo</button>
            <button onClick={handleSkip} className="secondary">Pular</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-card">
          <div className="onboarding-content">
            <Icons.TrendingUp size={48} style={{ color: 'var(--primary-light)' }} />
            <h2>Pronto para começar!</h2>
            <ul className="features">
              <li>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.BarChart size={24} style={{ color: 'var(--primary-light)' }} />
                </div>
                <div>
                  <strong>Dashboard Inteligente</strong>
                  <p>Visualize seus gastos em tempo real</p>
                </div>
              </li>
              <li>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Settings size={24} style={{ color: 'var(--primary-light)' }} />
                </div>
                <div>
                  <strong>Categorização Automática</strong>
                  <p>IA aprende com seu padrão</p>
                </div>
              </li>
              <li>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Smartphone size={24} style={{ color: 'var(--primary-light)' }} />
                </div>
                <div>
                  <strong>Mobile Otimizado</strong>
                  <p>Acesse de qualquer lugar</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="onboarding-actions">
            <button onClick={handleNext}>Começar</button>
          </div>
        </div>
      )}

      <div className="onboarding-dots">
        {[0, 1, 2].map(dot => (
          <div key={dot} className={`dot ${dot === step ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default Onboarding
