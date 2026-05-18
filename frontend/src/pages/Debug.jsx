import { transacoesData } from '../data/transacoes'

export default function Debug() {
  const keys = Object.keys(transacoesData)
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', fontFamily: 'monospace' }}>
      <h1>🔍 DEBUG - Chaves disponíveis em transacoesData:</h1>
      <pre style={{ backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
        {JSON.stringify(keys, null, 2)}
      </pre>
      
      <h2>Dados por chave:</h2>
      {keys.map(key => (
        <div key={key} style={{ marginBottom: '20px' }}>
          <h3>{key}</h3>
          <p>Total: {transacoesData[key]?.length || 0} itens</p>
          {transacoesData[key]?.length > 0 && (
            <pre style={{ backgroundColor: '#2a2a2a', padding: '10px', fontSize: '11px', maxHeight: '200px', overflowY: 'auto' }}>
              {JSON.stringify(transacoesData[key].slice(0, 2), null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
