import type { LegStatus, Vehicle } from "../types/dispatch";
import styles from "./FilterBar.module.css";

type FilterBarProps = {
  vehicles: Vehicle[];
  onDateChange: (date: string) => void;
  onCarNumberChange: (carNumber: string) => void;
  onStatusChange: (status: LegStatus | null) => void;  // nullに対応
  onAddClick: () => void;
  date: string;
};

const legStatuses: LegStatus[] = ["荷降完了", "空車回送", "配送中", "積荷あり"];

export function FilterBar({
  vehicles,
  onDateChange,
  onCarNumberChange,
  onStatusChange,
  onAddClick,
  date,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      <select onChange={(e) => onCarNumberChange(e.target.value)}>
        <option value="">全車両</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>
      <select onChange={(e) => {
        const val = e.target.value;
        onStatusChange(val === "" ? null : val as LegStatus);
      }}>
        <option value="">全ステータス</option>
        {legStatuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button className={styles.btn} onClick={onAddClick}>
        ＋配車を追加
      </button>
    </div>
  );
}