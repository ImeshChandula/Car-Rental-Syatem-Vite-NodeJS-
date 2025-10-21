export interface Car {
  id: number;
  title: string;
  description: string;
  is_booked: boolean;
  is_available: boolean;
  created_at: Date;
  updated_at?: Date;
}
