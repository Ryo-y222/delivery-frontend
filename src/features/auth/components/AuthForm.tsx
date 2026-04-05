import { useAppStore } from "../../../stores/appStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import styles from "./AuthPage.module.css";

export function AuthForm() {
  const { tab, setTab, toast, showToast } = useAppStore();
  console.log("toast in AuthForm:", toast);

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
        {tab === "login" && <LoginForm onSuccess={() => showToast("ログインしました")} />}
      {tab === "register" && <RegisterForm onSuccess={() => showToast("アカウントを作成しました")} />}
    </div>
  </div>
  );
}