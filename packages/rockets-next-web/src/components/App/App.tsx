"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { AuthProvider } from "@concepta/react-auth-provider";
import { ThemeProvider } from "@concepta/react-material-ui/dist/styles";
import { ClientProvider } from "@concepta/react-data-provider";
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

  const handleError = (error: unknown) =>
    toast.error(
      (error as NetworkError)?.response?.data?.message ||
        "Unable to process the request."
    );

  return (
    <ClientProvider
      baseUrl={process.env.NEXT_PUBLIC_API_URL}
      onRefreshTokenError={handleRefreshTokenError}
    >
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <AuthProvider onError={handleError}>
          <html lang="en">
            <body className={inter.className}>{children}</body>
          </html>
        </AuthProvider>
      </ThemeProvider>
    </ClientProvider>
  );
};

export default App;
