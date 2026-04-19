import type { DispatchPlan, TimelineStop, VehicleOption, DriverOption } from '../types/dispatch';

export const dispatchPlans: DispatchPlan[] = [
  {
    id: "DP-001",
    date: "2026/04/12",
    truck: "品川 800 あ 1234",
    truckType: "4tトラック",
    driver: "田中 健二",
    legs: [
      { num: 1, from: "東京", to: "名古屋", cargo: "精密機器", weight: "1.5t", status: "delivered", statusLabel: "配達済", eta: "10:00" },
      { num: 2, from: "名古屋", to: "大阪", cargo: "食料品", weight: "2.0t", status: "delivering", statusLabel: "配達中", eta: "14:00" },
      { num: 3, from: "大阪", to: "東京", cargo: "空荷", weight: "0t", status: "empty", statusLabel: "帰り便", eta: "18:00" },
    ],
  },
  {
    id: "DP-002",
    date: "2026/04/12",
    truck: "大阪 500 い 5678",
    truckType: "2tトラック",
    driver: "佐藤 誠",
    legs: [
      { num: 1, from: "大阪", to: "広島", cargo: "衣類", weight: "1.0t", status: "delivering", statusLabel: "配達中", eta: "12:00" },
      { num: 2, from: "広島", to: "福岡", cargo: "農産物", weight: "1.2t", status: "loaded", statusLabel: "積込済", eta: "16:00" },
    ],
  },
  {
    id: "DP-003",
    date: "2026/04/12",
    truck: "福岡 300 う 9012",
    truckType: "10tトラック",
    driver: "鈴木 一郎",
    legs: [
      { num: 1, from: "福岡", to: "熊本", cargo: "建材", weight: "5.0t", status: "loaded", statusLabel: "積込済", eta: "09:00" },
      { num: 2, from: "熊本", to: "鹿児島", cargo: "機械部品", weight: "4.5t", status: "empty", statusLabel: "待機中", eta: "13:00" },
      { num: 3, from: "鹿児島", to: "宮崎", cargo: "食料品", weight: "3.0t", status: "empty", statusLabel: "待機中", eta: "16:00" },
      { num: 4, from: "宮崎", to: "福岡", cargo: "空荷", weight: "0t", status: "empty", statusLabel: "帰り便", eta: "20:00" },
    ],
  },
];

export const timelineStops: TimelineStop[] = [
  { label: "東京", time: "08:00", status: "completed" },
  { label: "名古屋", time: "12:00", status: "completed" },
  { label: "大阪", time: "15:00", status: "active" },
  { label: "広島", time: "18:00", status: "pending" },
  { label: "福岡", time: "21:00", status: "pending" },
];

export const vehicleOptions: VehicleOption[] = [
  { id: "v1", plateNumber: "品川 800 あ 1234", vehicleType: "4tトラック" },
  { id: "v2", plateNumber: "大阪 500 い 5678", vehicleType: "2tトラック" },
  { id: "v3", plateNumber: "福岡 300 う 9012", vehicleType: "10tトラック" },
  { id: "v4", plateNumber: "名古屋 400 え 3456", vehicleType: "軽トラック" },
];

export const driverOptions: DriverOption[] = [
  { id: "d1", name: "田中 健二" },
  { id: "d2", name: "佐藤 誠" },
  { id: "d3", name: "鈴木 一郎" },
  { id: "d4", name: "山田 次郎" },
];