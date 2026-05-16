export const DEFAULT_CATEGORIES = [
  // Cartão (uppercase)
  { nome: 'GANHOS', cor: '#22c55e', emoji: '💰' },
  { nome: 'MENSAL', cor: '#3b82f6', emoji: '📅' },
  { nome: 'BEBIDAS', cor: '#60a5fa', emoji: '🍷' },
  { nome: 'PARA MIM', cor: '#ec4899', emoji: '💇' },
  { nome: 'APOSTAS', cor: '#f97316', emoji: '🎰' },
  { nome: 'COMIDA', cor: '#86efac', emoji: '🍔' },
  { nome: 'FESTAS', cor: '#fbbf24', emoji: '🎉' },
  { nome: 'PRESENTES', cor: '#f472b6', emoji: '🎁' },
  { nome: 'UBER', cor: '#1d4ed8', emoji: '🚗' },
  { nome: 'VAMO NESSA', cor: '#16a34a', emoji: '🟢' },
  { nome: 'VIAGENS', cor: '#38bdf8', emoji: '✈️' },
  { nome: 'VESTUÁRIO', cor: '#ef4444', emoji: '👕' },
  { nome: 'ESTACIONAMENTO', cor: '#9ca3af', emoji: '🅿️' },
  { nome: 'GASOLINA', cor: '#eab308', emoji: '⛽' },
  { nome: 'REAJUSTE', cor: '#fb923c', emoji: '🔧' },
  { nome: 'KAU', cor: '#d946ef', emoji: '👤' },
  { nome: 'OUTROS', cor: '#fbcfe8', emoji: '📌' },
  { nome: 'POD', cor: '#d1d5db', emoji: '🎙️' },
  { nome: 'INVESTIDO', cor: '#0ea5e9', emoji: '📈' },
  { nome: 'CARTÃO', cor: '#ea580c', emoji: '💳' },
  { nome: 'NAVEGANDOSP', cor: '#ff6b35', emoji: '💻' },
  { nome: 'LCL', cor: '#7dd3fc', emoji: '👤' },
  // Home.jsx (Title Case)
  { nome: 'Alimentação', cor: '#86efac', emoji: '🍔' },
  { nome: 'Assinatura', cor: '#60a5fa', emoji: '⚡' },
  { nome: 'Saúde', cor: '#10b981', emoji: '⚕️' },
  { nome: 'Transporte', cor: '#1d4ed8', emoji: '🚗' },
  { nome: 'Lazer', cor: '#f59e0b', emoji: '🎮' },
  { nome: 'Educação', cor: '#8b5cf6', emoji: '📚' },
  { nome: 'Moradia', cor: '#ef4444', emoji: '🏠' },
  { nome: 'Entrada', cor: '#22c55e', emoji: '💰' },
  { nome: 'Sem categoria', cor: '#e5e7eb', emoji: '📌' },
]

export const CATEGORY_COLORS = Object.fromEntries(
  DEFAULT_CATEGORIES.map(c => [c.nome, c.cor])
)

export const getCategoryColor = (categoria) => {
  return CATEGORY_COLORS[categoria] || '#e5e7eb'
}
