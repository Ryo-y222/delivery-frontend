import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schema";
import { FormField } from "../../../components/molecules/FormField";
import styles from "./AuthPage.module.css";
import { useAuth } from "../../../contexts/useAuth";
import { useNavigate } from "react-router-dom";

interface Props {
    onSuccess: () => void;
}

export function LoginForm( { onSuccess } :Props ) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register: loginField,
    handleSubmit: loginHandleSubmit,
    setError: loginSetError,
    formState: { errors: loginErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
        await login(data.email, data.password);
        onSuccess();
        navigate("/");
    } catch (e) {
        loginSetError("root", {
            message: e instanceof Error ? e.message : "エラーが発生しました",

        });
    }
  }

  return (
    <form onSubmit={loginHandleSubmit(onSubmit)}>
      <div className={styles.heading}>
        <h1>おかえりなさい</h1>
        <p>アカウントにログインしてください</p>
      </div>

      <FormField
        label="メールアドレス"
        type="email"
        placeholder="your@email.com"
        error={loginErrors.email?.message}
        {...loginField("email")}
      />

      <FormField
        label="パスワード"
        type="password"
        placeholder="••••••••"
        error={loginErrors.password?.message}
        {...loginField("password")}
      />

      {loginErrors.root && <div className={styles.rootError}>{loginErrors.root.message}</div>}
      <button className={styles.submitBtn} type="submit">ログイン</button>
    </form>
  );
}