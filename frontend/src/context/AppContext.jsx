import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [bancoAtivo, setBancoAtivo] = useState(() => {
    return localStorage.getItem('bancoAtivo') || 'C6 Bank';
  });

  const [mesAno, setMesAno] = useState(() => {
    const agora = new Date();
    return localStorage.getItem('mesAno') || JSON.stringify({
      mes: agora.getMonth() + 1,
      ano: agora.getFullYear(),
    });
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const updateBanco = useCallback((banco) => {
    setBancoAtivo(banco);
    localStorage.setItem('bancoAtivo', banco);
  }, []);

  const updateMesAno = useCallback((mes, ano) => {
    const mesAnoObj = { mes, ano };
    setMesAno(JSON.stringify(mesAnoObj));
    localStorage.setItem('mesAno', JSON.stringify(mesAnoObj));
  }, []);

  const getMesAno = () => {
    try {
      const parsed = JSON.parse(mesAno);
      return { mes: Number(parsed.mes), ano: Number(parsed.ano) };
    } catch {
      return { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() };
    }
  };

  return (
    <AppContext.Provider value={{
      bancoAtivo,
      updateBanco,
      mesAno: getMesAno(),
      updateMesAno,
      isAddModalOpen,
      setIsAddModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};
