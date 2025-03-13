import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import MessengerPage from "../pages/MessengerPage";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "../pages/Profile";

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
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
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
