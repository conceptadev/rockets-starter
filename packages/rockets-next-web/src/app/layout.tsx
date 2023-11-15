"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ThemeContextProvider from "@/context/ThemeContextProvider";
import App from "@/components/App/App";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContextProvider>
      <App>
        <ToastContainer
          hideProgressBar
          position="top-center"
          limit={3}
          autoClose={3000}
        />
        {children}
      </App>
    </ThemeContextProvider>
  );
};

export default RootLayout;
