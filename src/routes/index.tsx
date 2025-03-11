import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import MessengerPage from "../pages/MessengerPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <MessengerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;
