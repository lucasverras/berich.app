import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OutrosBancos.css'

function OutrosBancos() {
  const [bancos, setBancos] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOutrosBancos()
  }, [])

  const fetchOutrosBancos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/bancos/outros')
      setBancos(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar outros bancos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!bancos.length) return null

  return (
    <div className="outros-bancos-section">
      <h2 className="outros-bancos-title">Outros Bancos</h2>
      <div className="outros-bancos-container">
        {bancos.map(banco => (
          <div
            key={banco.id}
            className="banco-card"
            onClick={() => navigate(`/banco/${banco.nome}`)}
          >
            <div className="banco-card-left">
              <span className="banco-nome">{banco.nome}</span>
            </div>
            <div className="banco-card-right">
              <span className={`banco-saldo ${banco.saldo >= 0 ? 'positivo' : 'negativo'}`}>
                {banco.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutrosBancos
