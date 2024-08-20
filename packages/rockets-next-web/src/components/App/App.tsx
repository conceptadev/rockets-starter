"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@concepta/react-material-ui/dist/styles";
import { RocketsProvider } from "@concepta/react-material-ui";
import { toast } from "react-toastify";

import { ThemeContext, ThemeContextType } from "@/context/ThemeContextProvider";
import { themeLight, themeDark } from "@/styles/theme";
import "../../../src/app/globals.css";

interface NetworkError {
  response: {
    data: {
      message: string;
    };
  };
}

const inter = Inter({ subsets: ["latin"] });

const App = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { darkMode } = (useContext?.(ThemeContext) as ThemeContextType) || {};

  const handleRefreshTokenError = () => router.replace("/login");

  const handleSuccess = () => router.replace("/users");

  const handleError = (error: unknown) =>
    toast.error(
      (error as NetworkError)?.response?.data?.message ||
        "Unable to process the request."
    );

  return (
    <RocketsProvider
      auth={{
        // useAuth: myAuthHook,
        onAuthSuccess: handleSuccess,
        onAuthError: handleError,
        // onLogout: handleLogout,
        handleRefreshTokenError: handleRefreshTokenError,
      }}
      dataProvider={{ apiUrl: process.env.NEXT_PUBLIC_API_URL }}
    >
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ThemeProvider>
    </RocketsProvider>
  );
};

export default App;
