export type MaterialType = 'Topsoil' | 'Structural Fill' | 'Crushed Rock' | 'Import' | 'Export';
export type MeasurementType = 'Cubic Yards' | 'Tons';
export type ListingStatus = 'active' | 'completed' | 'inactive';

export interface Listing {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  site_name: string;
  material: MaterialType;
  quantity: number;
  quantity_moved: number;
  measurement_type: MeasurementType;
  address: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
  transaction_type: 'Import' | 'Export';
  completed_transactions?: {
    id: string;
    quantity_moved: number;
    partner_company: string;
    transaction_type: 'full' | 'partial';
    created_at: string;
  }[];
}

