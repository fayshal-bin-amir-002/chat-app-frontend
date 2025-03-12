import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RouterProvider } from "react-router/dom";
import router from "./routes/index.tsx";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
    <ToastContainer />
  </StrictMode>
);
