import { InputHTMLAttributes, ReactNode } from "react";
import styles from "./FormField.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  children?: ReactNode;
}

export function FormField({ label, error, children, ...inputProps }: Props) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children ?? <input className={styles.input} {...inputProps} />}
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

{/* <div className={styles.field}>
  <label className={styles.label}>メールアドレス</label>
  <input className={styles.input} type="email" placeholder="your@email.com" {...loginField("email")} />
  {loginErrors.email && <span className={styles.errorMsg}>{loginErrors.email.message}</span>}
</div> */}