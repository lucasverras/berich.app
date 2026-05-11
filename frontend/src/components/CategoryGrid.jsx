import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './CategoryGrid.css'

function CategoryGrid({ banco, mes, ano }) {
  const [categories, setCategories] = useState({})
  const [maxValue, setMaxValue] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategorias()
  }, [banco, mes, ano])

  const fetchCategorias = async () => {
    setLoading(true)
    try {
      const params = { mes, ano }
      if (banco) params.banco = banco

      const response = await axios.get('/api/resumo/categorias', { params })
      const porCategoria = response.data.por_categoria || {}

      setCategories(porCategoria)

      const max = Math.max(...Object.values(porCategoria).map(v => Math.abs(v)), 0)
      setMaxValue(max)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="categories-grid">Carregando...</div>
  }

  if (Object.keys(categories).length === 0) {
    return <div className="categories-grid">Sem categorias para este período</div>
  }

  return (
    <div className="categories-grid">
      {Object.entries(categories).map(([categoryName, value]) => {
        const absValue = Math.abs(value)
        const percentage = maxValue > 0 ? (absValue / maxValue) * 100 : 0
        const isNegative = value < 0

        return (
          <div key={categoryName} className="category-card">
            <div className="category-header">
              <span className="category-name">{categoryName}</span>
            </div>
            <div className="category-value">
              R$ {Math.abs(value).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <div className="category-progress">
              <div
                className="progress-bar"
                style={{
                  transform: `scaleX(${percentage / 100})`,
                  backgroundColor: isNegative ? 'var(--negative)' : 'var(--positive)',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CategoryGrid
