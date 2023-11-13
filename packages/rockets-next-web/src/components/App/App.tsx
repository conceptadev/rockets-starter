"use client";

import { useContext } from "react";
import "../../../src/app/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@concepta/react-auth-provider";
import { ThemeProvider } from "@concepta/react-material-ui/dist/styles";
import { ClientProvider } from "@concepta/react-data-provider";
import { ThemeContext, ThemeContextType } from "@/context/ThemeContextProvider";
import { themeLight, themeDark } from "@/styles/theme";

const inter = Inter({ subsets: ["latin"] });

const App = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = (useContext?.(ThemeContext) as ThemeContextType) || {};

  return (
    <ClientProvider
      baseUrl={process.env.NEXT_PUBLIC_API_URL}
      onRefreshTokenError={() => {}}
    >
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <AuthProvider>
          <html lang="en">
            <body className={inter.className}>{children}</body>
          </html>
        </AuthProvider>
      </ThemeProvider>
    </ClientProvider>
  );
};

export default App;
