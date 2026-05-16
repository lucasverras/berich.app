import { DEFAULT_CATEGORIES } from './categoryColors'

const STORAGE_KEY = 'berich_categorias'

// Lê do localStorage ou retorna padrões
const loadCategories = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Erro ao ler categorias do localStorage:', e)
  }
  return DEFAULT_CATEGORIES
}

// Salva no localStorage
const saveCategories = (categorias) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias))
  } catch (e) {
    console.warn('Erro ao salvar categorias no localStorage:', e)
  }
}

// Obtém todas as categorias
export const getAllCategories = () => {
  return loadCategories()
}

// Obtém a cor de uma categoria
export const getCategoryColor = (nome) => {
  const cat = loadCategories().find(c => c.nome === nome)
  return cat?.cor || '#e5e7eb'
}

// Obtém o emoji de uma categoria
export const getCategoryEmoji = (nome) => {
  const cat = loadCategories().find(c => c.nome === nome)
  return cat?.emoji || '📌'
}

// Adiciona uma nova categoria
export const addCategory = (nome, cor, emoji) => {
  const cats = loadCategories()
  if (!cats.find(c => c.nome === nome)) {
    cats.push({ nome, cor, emoji })
    saveCategories(cats)
  }
  return cats
}

// Atualiza uma categoria existente
export const updateCategory = (nome, cor, emoji) => {
  const cats = loadCategories()
  const idx = cats.findIndex(c => c.nome === nome)
  if (idx !== -1) {
    cats[idx] = { nome, cor, emoji }
    saveCategories(cats)
  }
  return cats
}

// Deleta uma categoria
export const deleteCategory = (nome) => {
  const cats = loadCategories()
  const filtered = cats.filter(c => c.nome !== nome)
  saveCategories(filtered)
  return filtered
}

// Reseta para padrões
export const resetToDefaults = () => {
  saveCategories(DEFAULT_CATEGORIES)
  return DEFAULT_CATEGORIES
}
