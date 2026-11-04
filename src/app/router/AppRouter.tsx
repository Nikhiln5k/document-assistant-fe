import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import AuthPage from "../../features/auth/components/AuthPage";
import HomePage from "../../features/home/HomePage";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import { paths } from "./paths";

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: paths.login, element: <AuthPage mode="login" /> },
      { path: paths.register, element: <AuthPage mode="register" /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: paths.home, element: <HomePage /> }],
  },
  { path: "*", element: <Navigate to={paths.home} replace /> },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
