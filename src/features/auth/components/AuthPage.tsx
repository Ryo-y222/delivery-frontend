import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput, registerSchema, type RegisterInput } from "../schema";
import { useAppStore } from '../../../stores/appStore';
import styles from "./AuthPage.module.css";

    const MOCK_USERS = [
  { email: "tanaka@example.com", password: "password123", name: "田中 太郎" },
];

export function AuthPage() {

    const { setPage, tab, setTab } = useAppStore();

    const {
        register: loginField,
        handleSubmit:loginHandleSubmit,
        setError: loginSetError,
        formState: { errors: loginErrors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const {
        register: registerField,
        handleSubmit: registerHandleSubmit,
        setValue: registerSetValue,
        watch: registerWatch,
        formState: { errors: registerErrors },
        } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const selectedRole = registerWatch("role")



function onSubmit(data: LoginInput) {
  const user = MOCK_USERS.find(
    (u) => u.email === data.email && u.password === data.password
  );

  if (user) {
    console.log("ログイン成功:", user.name);
    setPage("dashboard");
  } else {
    loginSetError("root", {        // ← 追加
      message: "メールアドレスまたはパスワードが正しくありません",
    });
  }
}

function onRegister(data: RegisterInput) {
  console.log("新規登録:", data);
  setTab("login");
}

  return (
  <div className={styles.shell}>

    {/* 左パネル */}
    <div className={styles.left}>
      <div className={styles.logo}>
        Track<em>Match</em>
      </div>
      <div className={styles.logoSub}>Freight Matching Platform</div>
      <div className={styles.catchCopy}>
        帰り便を、<br />収益に変える。
      </div>
      <div className={styles.catchDesc}>
        空車で走るコストを削減し、<br />
        運送会社同士の直接マッチングで<br />
        適正な運賃を実現します。
      </div>

      <div className={styles.features}>
  <div className={styles.feature}>
    <div className={styles.featureIcon}>⇌</div>
    <div className={styles.featureText}>帰り便・空き便を効率よくマッチング</div>
  </div>
  <div className={styles.feature}>
    <div className={styles.featureIcon}>⊡</div>
    <div className={styles.featureText}>運送会社同士の直接取引で中間マージンをカット</div>
  </div>
  <div className={styles.feature}>
    <div className={styles.featureIcon}>◆</div>
    <div className={styles.featureText}>相互評価で安心して取引できる信頼スコア</div>
  </div>
  <div className={styles.feature}>
    <div className={styles.featureIcon}>▣</div>
    <div className={styles.featureText}>決済代行で入金リスクをゼロに</div>
  </div>
</div>
    </div>

    {/* 右パネル */}
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

        {tab === "login" && (
          <form onSubmit={loginHandleSubmit(onSubmit)}>
            <div className={styles.heading}>
              <h1>おかえりなさい</h1>
              <p>アカウントにログインしてください</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>メールアドレス</label>
              <input className={styles.input} type="email" placeholder="your@email.com" {...loginField("email")} />
              {loginErrors.email && <span className={styles.errorMsg}>{loginErrors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>パスワード</label>
              <input className={styles.input} type="password" placeholder="••••••••" {...loginField("password")} />
              {loginErrors.password && <span className={styles.errorMsg}>{loginErrors.password.message}</span>}
            </div>
            {loginErrors.root && <div className={styles.rootError}>{loginErrors.root.message}</div>}
            <button className={styles.submitBtn} type="submit">ログイン</button>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={registerHandleSubmit(onRegister)}>
            <div className={styles.heading}>
              <h1>アカウント作成</h1>
              <p>無料で始めましょう</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>アカウント種別</label>
              <div className={styles.roleCards}>
                <div
                  className={`${styles.roleCard} ${selectedRole === "carrier" ? styles.selected : ""}`}
                  onClick={() => registerSetValue("role", "carrier")}
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
            <div className={styles.field}>
              <label className={styles.label}>お名前</label>
              <input className={styles.input} type="text" placeholder="田中 太郎" {...registerField("name")} />
              {registerErrors.name && <span className={styles.errorMsg}>{registerErrors.name.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>会社名</label>
              <input className={styles.input} type="text" placeholder="株式会社〇〇" {...registerField("company")} />
              {registerErrors.company && <span className={styles.errorMsg}>{registerErrors.company.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>メールアドレス</label>
              <input className={styles.input} type="email" placeholder="your@email.com" {...registerField("email")} />
              {registerErrors.email && <span className={styles.errorMsg}>{registerErrors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>パスワード</label>
              <input className={styles.input} type="password" placeholder="8文字以上" {...registerField("password")} />
              {registerErrors.password && <span className={styles.errorMsg}>{registerErrors.password.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>パスワード（確認）</label>
              <input className={styles.input} type="password" placeholder="もう一度入力" {...registerField("confirm")} />
              {registerErrors.confirm && <span className={styles.errorMsg}>{registerErrors.confirm.message}</span>}
            </div>
            <button className={styles.submitBtn} type="submit">登録する</button>
          </form>
        )}

      </div>
    </div>

  </div>
);
}