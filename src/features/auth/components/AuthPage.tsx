import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { BrandPanel } from "./BrandPanel";
import { AuthForm } from "./AuthForm";
import styles from "./AuthPage.module.css";

export function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "monospace", fontSize: 13, color: "#a1a09a" }}>
        読み込み中...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.shell}>
      <BrandPanel />
      <AuthForm />
    </div>
  );
}