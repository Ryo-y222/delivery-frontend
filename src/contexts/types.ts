export interface User {
  id: number;
  name: string;
  email: string;
  role: "shipper" | "transport_company";
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "shipper" | "transport_company";
  phone?: string;
  company? : string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}