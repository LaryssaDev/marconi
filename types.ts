
export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Professional {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  login?: string;
  password?: string;
  role: 'manager' | 'barber';
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  professionalId: string;
  serviceIds: string[]; // Changed from single serviceId to array
  date: string; // ISO format
  time: string; // "HH:00"
  status: BookingStatus;
  totalValue: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'manager' | 'barber';
  login: string;
}
