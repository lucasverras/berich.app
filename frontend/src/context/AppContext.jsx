import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [bancoAtivo, setBancoAtivo] = useState(() => {
    return localStorage.getItem('bancoAtivo') || 'C6 Bank';
  });

  const [mes, setMes] = useState(() => {
    const stored = localStorage.getItem('mes');
    if (stored) {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? new Date().getMonth() + 1 : parsed;
    }
    return new Date().getMonth() + 1;
  });

  const [ano, setAno] = useState(() => {
    const stored = localStorage.getItem('ano');
    if (stored) {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? new Date().getFullYear() : parsed;
    }
    return new Date().getFullYear();
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const updateBanco = useCallback((banco) => {
    setBancoAtivo(banco);
    localStorage.setItem('bancoAtivo', banco);
  }, []);

  const updateMesAno = useCallback((newMes, newAno) => {
    const mesInt = parseInt(newMes, 10);
    const anoInt = parseInt(newAno, 10);

    if (!isNaN(mesInt)) setMes(mesInt);
    if (!isNaN(anoInt)) setAno(anoInt);

    if (!isNaN(mesInt)) localStorage.setItem('mes', String(mesInt));
    if (!isNaN(anoInt)) localStorage.setItem('ano', String(anoInt));
  }, []);

  return (
    <AppContext.Provider value={{
      bancoAtivo,
      updateBanco,
      mes,
      ano,
      updateMesAno,
      isAddModalOpen,
      setIsAddModalOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};
