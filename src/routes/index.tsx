import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../features/auth/components/AuthPage";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { MatchingPage } from "../pages/MatchingPage";
import { DispatchPage } from "../pages/DispatchPage";
import { ChatPage } from "../pages/ChatPage";
import { PaymentPage } from "../pages/PaymentPage";
import { ReviewPage } from "../pages/ReviewPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout title="ダッシュボード" subtitle={new Date().toLocaleDateString("ja-JP")} />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/matching", element: <MatchingPage /> },
          { path: "/dispatch", element: <DispatchPage /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/payment", element: <PaymentPage /> },
          { path: "/review", element: <ReviewPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);