export type CargoStatus = 'loaded' | 'empty' | 'delivering' | 'delivered';

export interface TripLeg {
  num: number;
  from: string;
  to: string;
  cargo: string;
  weight: string;
  status: CargoStatus;
  statusLabel: string;
  eta: string;
}

export interface DispatchPlan {
  id: string;
  date: string;
  truck: string;
  truckType: string;
  driver: string;
  legs: TripLeg[];
}

export interface TimelineStop {
  label: string;
  time: string;
  status: 'completed' | 'active' | 'pending';
}

export interface VehicleOption {
  id: string;
  plateNumber: string;
  vehicleType: string;
}

export interface DriverOption {
  id: string;
  name: string;
}