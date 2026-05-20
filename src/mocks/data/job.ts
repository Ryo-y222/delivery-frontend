import type { Job, Vehicle } from "../../features/dispatch/types/dispatch";

export const mockDb = {
  jobs: [
    {
      id: "j1",
      vehicleId: "v1",
      title: "現場Aへ搬入",
      planDate: "2026-05-20",
      startHour: 8,
      startMinute: 0,
      endHour: 9,
      endMinute: 30,
      tripLegs: [
        { legNumber: 1, route: "アクティオ高知 → 高知港", time: "09:30", cargo: "バックホウ0.45", weight: "4.5t", status: "積荷あり" as const },
      ],
    },
    {
      id: "j2",
      vehicleId: "v2",
      title: "早明浦ダム搬入",
      planDate: "2026-05-20",
      startHour: 9,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
      tripLegs: [
        { legNumber: 1, route: "ナガワ高知営業所 → 早明浦ダム大林組現場", time: "12:00", cargo: "2坪ハウス", weight: "1.2t", status: "配送中" as const },
      ],
    },
    {
      id: "j3",
      vehicleId: "v1",
      title: "高知港回送",
      planDate: "2026-05-20",
      startHour: 13,
      startMinute: 0,
      endHour: 15,
      endMinute: 0,
      tripLegs: [
        { legNumber: 1, route: "高知港 → アクティオ高知", time: "15:00", cargo: "空荷", weight: "—", status: "空車回送" as const },
      ],
    },
    {
      id: "j4",
      vehicleId: "v1",
      title: "現場B搬入",
      planDate: "2026-05-21",
      startHour: 8,
      startMinute: 30,
      endHour: 11,
      endMinute: 0,
      tripLegs: [
        { legNumber: 1, route: "アクティオ高知 → 早明浦ダム大林組現場", time: "11:00", cargo: "クローラークレーン", weight: "8.0t", status: "積荷あり" as const },
      ],
    },
    {
      id: "j5",
      vehicleId: "v3",
      title: "南国SA経由配送",
      planDate: "2026-05-21",
      startHour: 10,
      startMinute: 0,
      endHour: 14,
      endMinute: 0,
      tripLegs: [
        { legNumber: 1, route: "アクティオ高知 → 南国サービスエリア", time: "11:00", cargo: "足場材", weight: "2.0t", status: "配送中" as const },
        { legNumber: 2, route: "南国サービスエリア → 早明浦ダム大林組現場", time: "14:00", cargo: "足場材", weight: "2.0t", status: "積荷あり" as const },
      ],
    },
    {
      id: "j6",
      vehicleId: "v2",
      title: "資材回収",
      planDate: "2026-05-22",
      startHour: 9,
      startMinute: 0,
      endHour: 16,
      endMinute: 0,
      tripLegs: [
        { legNumber: 1, route: "早明浦ダム大林組現場 → 高知港", time: "12:00", cargo: "鉄板", weight: "3.5t", status: "荷降完了" as const },
        { legNumber: 2, route: "高知港 → アクティオ高知", time: "16:00", cargo: "空荷", weight: "—", status: "空車回送" as const },
      ],
    },
  ] as Job[],

  vehicles: [
    { id: "v1", name: "1号車", driverName: "山田 一郎" },
    { id: "v2", name: "2号車", driverName: "田中 次郎" },
    { id: "v3", name: "3号車", driverName: "佐藤 三郎" },
  ] as Vehicle[],

  locations: [
    "アクティオ高知",
    "ナガワ高知営業所",
    "早明浦ダム大林組現場",
    "高知港",
    "南国サービスエリア",
  ],
};