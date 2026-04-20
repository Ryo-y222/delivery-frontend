import { BrandPanel } from "./BrandPanel";
import { AuthForm } from "./AuthForm";
import { useAppStore } from "../../../stores/appStore";
import { Toast } from "../../../components/atoms/Toast";
import styles from "./AuthPage.module.css";

export function AuthPage() {

    const { toast } = useAppStore();
  return (
    <div className={styles.shell}>
      <BrandPanel />
      <AuthForm />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}