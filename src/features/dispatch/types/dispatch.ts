export type Vehicle = {
  id: string;
  name: string;
  driverName: string;
};

export type LegStatus = "荷降完了" | "空車回送" | "配送中" | "積荷あり";

export type TripLeg = {
  legNumber: number;
  route: string; // 例：アクティオ高知 → 早明浦ダム
  time: string; // 到着予定時刻
  cargo: string; // 荷物名（複数の場合はカンマ区切り）
  weight: string; // 重量
  status: LegStatus;
};

export type Job = {
  id: string;
  vehicleId: string; // どの車両の行に出すか
  title: string; // ガントバーのラベル（空なら自動生成）
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  // OrderFormから生成される情報
  driverId?: string;
  planDate?: string;
  note?: string;
  tripLegs?: TripLeg[]; // DispatchCardに渡す区間情報
};

export type PreviewBar = {
  vehicleId: string;
  left: number;
  width: number;
  text: string;
};

// export type Vehicle = {
//   id: string;
//   name: string;
//   driverName: string;
// };

// export type Job = {
//   id: string;
//   vehicleId: string; // どの車両の行に出すか
//   title: string;
//   startHour: number;
//   startMinute: number;
//   endHour: number;
//   endMinute: number;
// };

// export type PreviewBar = {
//   vehicleId: string;
//   left: number;
//   width: number;
//   text: string;
// };
