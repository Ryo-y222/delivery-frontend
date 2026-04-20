import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import styles from "./AuthPage.module.css";

export function AuthForm() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className={styles.right}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
            onClick={() => setTab("login")}
          >
            ログイン
          </button>
          <button
            className={`${styles.tab} ${tab === "register" ? styles.active : ""}`}
            onClick={() => setTab("register")}
          >
            新規登録
          </button>
        </div>
        {tab === "login" && <LoginForm onSuccess={() => {}} />}
        {tab === "register" && <RegisterForm onSuccess={() => {}} />}    
    </div>
  </div>
  );
}