import React, { Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import MainRouter from "./routes";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/loader";
import { AuthProvider } from "./core/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <ToastContainer autoClose={5000} transition={Slide} />
      <BrowserRouter>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
);
