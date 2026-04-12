import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "../features/auth/components/AuthPage";
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
    // 認証が必要なルート
    element: <ProtectedRoute />,
    children: [
      { path: "/",        element: <DashboardPage /> },
      { path: "/matching", element: <MatchingPage /> },
      { path: "/dispatch", element: <DispatchPage /> },
      { path: "/chat",     element: <ChatPage /> },
      { path: "/payment",  element: <PaymentPage /> },
      { path: "/review",   element: <ReviewPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);