import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStoredGrade, setStoredGrade } from '../services/api';

interface GradeContextType {
  grade: number;
  setGrade: (newGrade: number) => void;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grade, setGradeState] = useState<number>(() => getStoredGrade());

  const setGrade = useCallback((newGrade: number) => {
    setGradeState(newGrade);
    setStoredGrade(newGrade);
  }, []);

  return (
    <GradeContext.Provider value={{ grade, setGrade }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGrade = (): GradeContextType => {
  const ctx = useContext(GradeContext);
  if (!ctx) {
    throw new Error('useGrade must be used within a GradeProvider');
  }
  return ctx;
};
