import React from 'react';
import { LanguageContext, useLanguageLogic } from '@/hooks/useLanguage';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const languageLogic = useLanguageLogic();

  return (
    <LanguageContext.Provider value={languageLogic}>
      {children}
    </LanguageContext.Provider>
  );
}