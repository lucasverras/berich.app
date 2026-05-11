import React from 'react'
import '../styles/CategoryFilters.css'

function CategoryFilters({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filters-scroll">
      <button
        className={`category-filter-pill ${selectedCategory === 'Todas' ? 'active' : ''}`}
        onClick={() => onCategoryChange('Todas')}
      >
        Todas
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          className={`category-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilters
