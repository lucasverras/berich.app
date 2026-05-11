import React from 'react'
import { Check, UtensilsCrossed, Car, Home, Heart, Gamepad2, BookOpen, ShoppingBag, Film, Plane, Zap } from 'lucide-react'
import '../styles/CategoryFilters.css'

const CATEGORY_ICONS = {
  'Alimentação': UtensilsCrossed,
  'Transporte': Car,
  'Moradia': Home,
  'Saúde': Heart,
  'Lazer': Gamepad2,
  'Educação': BookOpen,
  'Compras': ShoppingBag,
  'Diversão': Film,
  'Viagem': Plane,
  'Assinatura': Zap,
}

function CategoryFilters({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filters-scroll">
      <button
        className={`category-filter-pill ${selectedCategory === 'Todas' ? 'active' : ''}`}
        onClick={() => onCategoryChange('Todas')}
      >
        <Check size={16} />
        <span>Todas</span>
      </button>
      {categories.map(cat => {
        const IconComponent = CATEGORY_ICONS[cat]
        return (
          <button
            key={cat}
            className={`category-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {IconComponent ? <IconComponent size={16} /> : <span>•</span>}
            <span>{cat}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilters
