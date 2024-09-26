import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      hideProgressBar
      position="top-center"
      limit={3}
      autoClose={3000}
    />
    <App />
  </StrictMode>
);
