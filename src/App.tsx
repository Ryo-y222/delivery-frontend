import { useAppStore } from "./stores/appStore";
import { AuthPage } from "./features/auth/components/AuthPage";
import { Toast } from "./components/atoms/Toast";
import "./styles/global.css";

export default function App() {
  const { page, toast } = useAppStore();
  console.log("App toast:", toast);

  return (
    <>
      {page === "auth" && <AuthPage />}
      {page === "dashboard" && <div>ダッシュボード（仮）</div>}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
