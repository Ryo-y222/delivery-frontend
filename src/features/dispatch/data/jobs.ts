import type { Job } from "../types/dispatch";

export const jobsByDate: Record<string, Job[]> = {
  "2026-03-21": [
    {
      id: "j1",
      vehicleId: "v1",
      title: "現場Aへ搬入",
      startHour: 8,
      startMinute: 0,
      endHour: 9,
      endMinute: 30,
    },
    {
      id: "j2",
      vehicleId: "v1",
      title: "現場Bへ移動",
      startHour: 11,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
    },
    {
      id: "j3",
      vehicleId: "v2",
      title: "現場Cへ回送",
      startHour: 9,
      startMinute: 30,
      endHour: 11,
      endMinute: 0,
    },
  ],
  "2026-03-22": [
    {
      id: "j4",
      vehicleId: "v1",
      title: "東京→横浜",
      startHour: 8,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
    },
    {
      id: "j5",
      vehicleId: "v3",
      title: "横浜→名古屋",
      startHour: 13,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
    },
  ],
};
