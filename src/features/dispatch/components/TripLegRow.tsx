import type { LegStatus, TripLeg } from "../types/dispatch";
import styles from "./TripLegRow.module.css";

export type TripLegRowProps = {
  leg: TripLeg;
};

const statusClass: Record<LegStatus, string> = {
  "荷降完了": styles.sDone,
  "空車回送": styles.sEmpty,
  "配送中": styles.sDelivering,
  "積荷あり": styles.sLoaded,
};

export function TripLegRow({ leg }: TripLegRowProps) {
  return (
    <div className={styles.legRow}>
      <div className={styles.legNum}>{leg.legNumber}</div>
      <div className={styles.legInfo}>
        <div className={styles.legRoute}>{leg.route}</div>
        <div className={styles.legTime}>
          <i className="ti ti-clock" aria-hidden="true" />
          {leg.time} 着予定
        </div>
      </div>
      <div className={styles.legCargo}>{leg.cargo}</div>
      <div className={styles.legWeight}>{leg.weight}</div>
      <span className={`${styles.statusBadge} ${statusClass[leg.status]}`}>
        {leg.status}
      </span>
    </div>
  );
}

// import type { LegStatus, TripLeg } from "../types/dispatch";
// import styles from "./TripLegRow.module.css";

// export type TripLegRowProps = TripLeg & {
//   onUpdate: () => void;
//   onDetail: () => void;
// };

// export function TripLegRow({
//   legNumber,
//   route,
//   time,
//   cargo,
//   weight,
//   status,
//   onUpdate,
//   onDetail,
// }: TripLegRowProps) {
//   const getStatusClass = (status: LegStatus): string => {
//     switch (status) {
//       case "荷降完了":
//         return styles.completed;
//       case "空車回送":
//         return styles.empty;
//       case "配送中":
//         return styles.delivering;
//       case "積荷あり":
//         return styles.loaded;
//     }
//   };

//   return (
//     <div className={styles.card}>
//       <div className={styles.legNumber}>{legNumber}</div>
//       <div className={styles.legInfo}>
//         <div className={styles.route}>{route}</div>
//         <div className={styles.time}>{time}</div>
//       </div>
//       <div className={styles.cargo}>{cargo}</div>
//       <div className={styles.weight}>{weight}</div>
//       <div className={getStatusClass(status)}>{status}</div>
//       <button className={styles.btn} onClick={onUpdate}>
//         更新
//       </button>
//       <button className={styles.btn} onClick={onDetail}>
//         詳細
//       </button>
//     </div>
//   );
// }
