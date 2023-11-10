"use client";

import "./globals.css";
import ThemeContextProvider from "@/context/ThemeContextProvider";
import App from "@/components/App/App";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContextProvider>
      <App>{children}</App>
    </ThemeContextProvider>
  );
};

export default RootLayout;
