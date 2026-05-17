import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout, AuthLayout } from "./layout";
import { ProtectedRoute, UnProtectedRoute } from "./protected";
import Login from "../pages/auth/login";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import DashboardPage from "../pages/dashboard";
import RegisterPage from "../pages/auth/register";
import ConfirmOtpPage from "@/pages/auth/confirm-otp";
import ResetPasswordPage from "@/pages/auth/reset-password";
import { AddOrEditReceiptPage } from "@/pages/receipts/add-or-edit-receipt";

export const router = createBrowserRouter([
  // AUTH ROUTES (Public Only)
  {
    element: <UnProtectedRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/confirm-otp", element: <ConfirmOtpPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },

  // APP ROUTES (Protected Only)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/add-receipt/", element: <AddOrEditReceiptPage /> },
          {
            path: "/edit-receipt/:receiptId",
            element: <AddOrEditReceiptPage />,
          },
          // { path: "/receipts", element: <ReceiptsListPage /> },
          // { path: "/receipts/add", element: <AddReceiptPage /> },
        ],
      },
    ],
  },

  // Root Redirect
  { path: "/", element: <Navigate to="/dashboard" replace /> },
]);
