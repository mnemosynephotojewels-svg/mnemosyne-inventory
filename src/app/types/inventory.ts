export interface PackagingMaterial {
  id: string;
  name: string;
  stock: number;
  quantity?: number; // Alias for stock for backward compatibility
  unit: string;
  reorderLink?: string;
  imageUrl?: string;
  monthlyThreshold?: number;
}

export interface RawMaterial {
  id: string;
  name: string;
  stock: number;
  quantity?: number; // Alias for stock for backward compatibility
  unit: string;
  reorderLink?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  monthlyThreshold?: number;
}

export interface BillOfMaterial {
  materialId?: string;
  material_id?: string; // Alias for consistency
  quantity: number;
  type?: 'raw' | 'packaging'; // Type of material
}

export interface FinishedProduct {
  id: string;
  name: string;
  category?: string;
  subCategory?: string;
  gender?: string;
  stock?: number;
  quantity: number; // Primary quantity field
  billOfMaterials?: BillOfMaterial[];
  imageUrl?: string;
  description?: string; // Added Description
}

export interface ActivityLog {
  id?: string;
  timestamp: Date | string;
  action: string;
  productName?: string;
  materialName?: string;
  packagingName?: string;
  quantity?: number;
  quantity_change?: number;
  affectedMaterials?: { materialName: string; quantity: number }[];
  description?: string;
  details?: string;
  category?: string;
  item_id?: string;
  isNew?: boolean;
  // Stock tracking for deductions
  previousStock?: number;
  newStock?: number;
}
