import React from 'react'
import '../styles/CategoryFilters.css'

const CATEGORY_ICONS = {
  'Alimentação': '🍽️',
  'Transporte': '🚗',
  'Moradia': '🏠',
  'Saúde': '🏥',
  'Lazer': '🎮',
  'Educação': '📚',
  'Compras': '🛍️',
  'Diversão': '🎬',
  'Viagem': '✈️',
  'Assinatura': '📱',
}

function CategoryFilters({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filters-scroll">
      <button
        className={`category-filter-pill ${selectedCategory === 'Todas' ? 'active' : ''}`}
        onClick={() => onCategoryChange('Todas')}
      >
        <span>✓</span>
        <span>Todas</span>
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          className={`category-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          <span>{CATEGORY_ICONS[cat] || '•'}</span>
          <span>{cat}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilters
