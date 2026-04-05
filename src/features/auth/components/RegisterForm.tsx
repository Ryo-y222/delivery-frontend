import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schema";
import { FormField } from "../../../components/molecules/FormField";
import styles from "./AuthPage.module.css";
import { useRegister } from "../hooks/useRegister";
import { useAppStore } from "../../../stores/appStore";

interface Props {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: Props) {
  const { setTab } = useAppStore();

  const { register: registerAPI } = useRegister();

  const {
    register: registerField,
    handleSubmit: registerHandleSubmit,
    setValue: registerSetValue,
    watch: registerWatch,
    formState: { errors: registerErrors },
    setError: registerSetError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = registerWatch("role");

  async function onRegister(data: RegisterInput) {
    try {
        await registerAPI ({
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role,
            company: data.company,
        });
        onSuccess();
        setTab("login");
    } catch (e) {
        registerSetError("root", {
            message: e instanceof Error ? e.message : "エラーが発生しました"
        })
    }
  }

  return (
    <form onSubmit={registerHandleSubmit(onRegister)}>
      <div className={styles.heading}>
        <h1>アカウント作成</h1>
        <p>無料で始めましょう</p>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>アカウント種別</label>
        <div className={styles.roleCards}>
          <div
            className={`${styles.roleCard} ${selectedRole === "transport_company" ? styles.selected : ""}`}
            onClick={() => registerSetValue("role", "transport_company")}
          >
            <div className={styles.roleCardName}>運送会社</div>
            <div className={styles.roleCardDesc}>荷物を運ぶ・帰り便を出す</div>
          </div>
          <div
            className={`${styles.roleCard} ${selectedRole === "shipper" ? styles.selected : ""}`}
            onClick={() => registerSetValue("role", "shipper")}
          >
            <div className={styles.roleCardName}>荷主</div>
            <div className={styles.roleCardDesc}>荷物を出して運送会社を探す</div>
          </div>
        </div>
        {registerErrors.role && <span className={styles.roleError}>{registerErrors.role.message}</span>}
      </div>
      <FormField
        label="お名前"
        type="text"
        placeholder="田中太郎"
        error={registerErrors.name?.message}
        {...registerField("name")}
       />
      <FormField
        label="会社名"
        type="text"
        placeholder="株式会社○○"
        error={registerErrors.company?.message}
        {...registerField("company")}
       />
      <FormField
        label="メールアドレス"
        type="email"
        placeholder="your@email.com"
        error={registerErrors.email?.message}
        {...registerField("email")}
       />
      <FormField
        label="パスワード"
        type="password"
        placeholder="8文字以上"
        error={registerErrors.password?.message}
        {...registerField("password")}
       />
      <FormField
        label="パスワード（確認）"
        type="password"
        placeholder="もう一度入力"
        error={registerErrors.confirm?.message}
        {...registerField("confirm")}
       />
       {registerErrors.root && <div className={styles.rootError}>{registerErrors.root.message}</div>}
      <button className={styles.submitBtn} type="submit">登録する</button>
    </form>
  );
}