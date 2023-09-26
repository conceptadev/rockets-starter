'use client';

import { createContext, FC, ReactNode, useState } from 'react';

export type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (isOn: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

type Props = {
  children: ReactNode;
};

const ThemeContextProvider: FC<Props> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
