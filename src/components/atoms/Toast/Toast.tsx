import { useState, useEffect } from "react";
import styles from "./Toast.module.css";

interface Props {
  message: string;
  type?: "success" | "error";
}

export function Toast({ message, type = "success" }: Props) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHiding(true), 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.toast} ${styles[type]} ${hiding ? styles.hiding : ""}`}>
      {message}
    </div>
  );
}