import type { Job } from "../types/dispatch";
import { TripLegRow } from "./TripLegRow";
import styles from "./DispatchCard.module.css";

type DispatchCardProps = {
  job: Job;
  vehicleName: string;
  driverName: string;
  onEdit: (job: Job) => void;
};

export function DispatchCard({
  job,
  vehicleName,
  driverName,
  onEdit,
}: DispatchCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.vehicleBadge}>{vehicleName}</span>
          <span className={styles.driverName}>{driverName}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.dateLabel}>
            <i className="ti ti-calendar" aria-hidden="true" />
            {job.planDate ?? ""}
          </span>
          <button className={styles.editBtn} onClick={() => onEdit(job)}>
            <i className="ti ti-edit" aria-hidden="true" />
            編集
          </button>
        </div>
      </div>
      {job.tripLegs && job.tripLegs.length > 0 ? (
        job.tripLegs.map((leg) => (
          <TripLegRow key={leg.legNumber} leg={leg} />
        ))
      ) : (
        <div className={styles.empty}>区間情報がありません</div>
      )}
    </div>
  );
}

// import type { Job } from "../types/dispatch";
// import { TripLegRow } from "./TripLegRow";
// import styles from "./DispatchCard.module.css";

// type DispatchCardProps = {
//   job: Job;
//   vehicleName: string;
//   driverName: string;
// };

// export function DispatchCard({
//   job,
//   vehicleName,
//   driverName,
// }: DispatchCardProps) {
//   // console.log("DispatchGanttで受け取ったjobList", jobList);
//   console.log("DispatchCardで受け取ったjob", job);
//   return (
//     <div className={styles.card}>
//       <div className={styles.cardHeader}>
//         <div className={styles.carNumber}>{vehicleName}</div>
//         <div className={styles.driverName}>{driverName}</div>
//         <div className={styles.date}>{job.planDate ?? ""}</div>
//       </div>
//       {job.tripLegs && job.tripLegs.length > 0 ? (
//         job.tripLegs.map((leg) => (
//           <TripLegRow
//             key={leg.legNumber}
//             {...leg}
//             onUpdate={() => console.log("update", leg.legNumber)}
//             onDetail={() => console.log("detail", leg.legNumber)}
//           />
//         ))
//       ) : (
//         <div className={styles.empty}>区間情報がありません</div>
//       )}
//     </div>
//   );
// }

// import React from "react";
// import { TripLegRow, TripLegRowProps } from "./TripLegRow";

// import styles from "./DispatchCard.module.css";

// type DispatchCardProps = {
//   carNumber: string;
//   driverName: string;
//   date: string;
//   tripLegRows: TripLegRowProps[];
// };

// export function DispatchCard({
//   carNumber,
//   driverName,
//   date,
//   tripLegRows,
// }: DispatchCardProps) {
//   return (
//     <div className={styles.card}>
//       <div className={styles.cardHeader}>
//         <div className={styles.carNumber}>{carNumber}</div>
//         <div className={styles.driverName}>{driverName}</div>
//         <div className={styles.date}>{date}</div>
//       </div>
//       {tripLegRows.map((tripLegRow) => (
//         <TripLegRow {...tripLegRow} key={tripLegRow.legNumber} />
//       ))}
//     </div>
//   );
// }
