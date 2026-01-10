import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#7f1d1d",
          color: "#fef3c7",
          border: "2px solid #fbbf24",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "600",
        },
        success: {
          iconTheme: {
            primary: "#fbbf24",
            secondary: "#7f1d1d",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fef3c7",
          },
        },
      }}
    />
  </StrictMode>
);
