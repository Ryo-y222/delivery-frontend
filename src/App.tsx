import { useAppStore } from "./stores/appStore";
import { AuthPage } from "./features/auth/components/AuthPage";
import "./styles/global.css";

export default function App() {
  const { page } = useAppStore();

  if (page === "auth") return <AuthPage />;
  return <div>ダッシュボード（仮）</div>;
}
