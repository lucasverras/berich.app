import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import './BankTabs.css'

function BankTabs() {
  const { bancoAtivo, updateBanco } = useContext(AppContext)
  const [bancos, setBancos] = useState([])

  useEffect(() => {
    fetchBancos()
  }, [])

  const fetchBancos = async () => {
    try {
      const response = await axios.get('/api/bancos')
      setBancos(response.data)
    } catch (error) {
      console.error('Erro ao buscar bancos:', error)
    }
  }

  return (
    <div className="bank-tabs">
      {bancos.map((banco) => (
        <button
          key={banco.id}
          className={`tab ${bancoAtivo === banco.nome ? 'active' : ''}`}
          onClick={() => updateBanco(banco.nome)}
        >
          {banco.nome}
        </button>
      ))}
    </div>
  )
}

export default BankTabs
