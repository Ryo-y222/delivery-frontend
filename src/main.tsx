// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
            position="bottom-center"
            toastOptions={{
            duration: 3000,
            style: {
            borderRadius: "8px",
            fontSize: "14px",
            padding: "12px 24px",
            minWidth: "320px",
            marginBottom: "40px",
          },
        }}
    />
    </AuthProvider>
  </StrictMode>
);
