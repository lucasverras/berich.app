import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const getDefaultFechamentoDays = () => {
    return {
      1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1,
      7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1
    };
  };

  const getInitialMonth = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const diasFechStore = localStorage.getItem('diasFechamento');
    let diasFech = getDefaultFechamentoDays();

    if (diasFechStore) {
      try {
        diasFech = JSON.parse(diasFechStore);
      } catch { }
    }

    const closingDay = diasFech[currentMonth] || 1;
    if (currentDay > closingDay) {
      return currentMonth === 12 ? 1 : currentMonth + 1;
    }
    return currentMonth;
  };

  const getInitialYear = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const diasFechStore = localStorage.getItem('diasFechamento');
    let diasFech = getDefaultFechamentoDays();

    if (diasFechStore) {
      try {
        diasFech = JSON.parse(diasFechStore);
      } catch { }
    }

    const closingDay = diasFech[currentMonth] || 1;
    if (currentDay > closingDay && currentMonth === 12) {
      return today.getFullYear() + 1;
    }
    return today.getFullYear();
  };

  const [bancoAtivo, setBancoAtivo] = useState(() => {
    return localStorage.getItem('bancoAtivo') || 'C6 Bank';
  });

  const [mes, setMes] = useState(() => {
    const stored = localStorage.getItem('mes');
    if (stored) {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? getInitialMonth() : parsed;
    }
    return getInitialMonth();
  });

  const [ano, setAno] = useState(() => {
    const stored = localStorage.getItem('ano');
    if (stored) {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? getInitialYear() : parsed;
    }
    return getInitialYear();
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [diasFechamento, setDiasFechamento] = useState(() => {
    const stored = localStorage.getItem('diasFechamento');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getDefaultFechamentoDays();
      }
    }
    return getDefaultFechamentoDays();
  });

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

  const updateFechamentoDia = useCallback((mes, dia) => {
    const mesInt = parseInt(mes, 10);
    const diaInt = parseInt(dia, 10);

    if (!isNaN(mesInt) && !isNaN(diaInt) && diaInt >= 1 && diaInt <= 31) {
      const updated = { ...diasFechamento, [mesInt]: diaInt };
      setDiasFechamento(updated);
      localStorage.setItem('diasFechamento', JSON.stringify(updated));
    }
  }, [diasFechamento]);

  return (
    <AppContext.Provider value={{
      bancoAtivo,
      updateBanco,
      mes,
      ano,
      updateMesAno,
      isAddModalOpen,
      setIsAddModalOpen,
      diasFechamento,
      updateFechamentoDia,
    }}>
      {children}
    </AppContext.Provider>
  );
};
