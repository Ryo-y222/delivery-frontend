import styles from "./AuthPage.module.css";

export function BrandPanel() {
  return (
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
  );
}