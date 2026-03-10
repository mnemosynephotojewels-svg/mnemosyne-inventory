import { supabase, RAW_MATERIALS_TABLE, PACKAGING_TABLE, FINISHED_PRODUCTS_TABLE, ACTIVITY_LOGS_TABLE, isConfigured } from '../lib/supabase';
import { RawMaterial, PackagingMaterial, FinishedProduct, ActivityLog } from '../types/inventory';

// Helper function to handle network errors
const handleNetworkError = (error: any, operation: string) => {
  console.error(`❌ ${operation} failed:`, error);
  
  // Check for network-related errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    throw new Error('Network error: Unable to connect to Supabase. Please check:\n1. Your internet connection\n2. Supabase project is not paused\n3. Supabase URL is correct');
  }
  
  // Check for other common errors
  if (error.message?.includes('CORS')) {
    throw new Error('CORS error: Unable to connect to Supabase. Please check your project settings.');
  }
  
  if (error.message?.includes('JWT')) {
    throw new Error('Authentication error: Invalid Supabase key. Please check your credentials.');
  }
  
  // Generic error
  throw new Error(`${operation} failed: ${error.message || 'Unknown error'}`);
};

// Test connection function
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!isConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured. Please add your credentials to the configuration file.'
    };
  }
  
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase
      .from(RAW_MATERIALS_TABLE)
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
    
    console.log('✅ Supabase connection successful!');
    return {
      success: true,
      message: 'Successfully connected to Supabase!'
    };
  } catch (error: any) {
    console.error('❌ Connection test error:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Cannot connect to Supabase. Please check:\n• Your internet connection\n• Supabase project is active (not paused)\n• URL is correct in configuration'
      };
    }
    
    return {
      success: false,
      message: `Connection error: ${error.message}`
    };
  }
};

export const api = {
  // ===================================
  // RAW MATERIALS - DIRECT SUPABASE
  // ===================================
  
  async getRawMaterials(): Promise<RawMaterial[]> {
    try {
      console.log('📦 Fetching raw materials from Supabase...');
      
      // Fetch all columns including category and description
      const { data, error } = await supabase
        .from(RAW_MATERIALS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') {
          console.error('❌ Database table not created yet');
          console.info('📋 Please run the SQL script in /supabase/init.sql');
        } else if (error.message.includes('description')) {
          console.error('❌ Description column not added yet');
          console.info('📋 Please run: ALTER TABLE raw_materials ADD COLUMN description TEXT;');
        } else {
          console.error('❌ Supabase error:', error.message);
        }
        return [];
      }
      
      // Convert database format to app format
      const materials: RawMaterial[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        stock: Number(item.stock),
        quantity: Number(item.stock), // Alias for stock
        unit: item.unit,
        category: item.category || '',
        description: item.description || '',
        imageUrl: item.image_url,
        reorderLink: item.reorder_link,
        monthlyThreshold: item.monthly_threshold ? Number(item.monthly_threshold) : undefined,
      }));
      
      console.log(`✅ Loaded ${materials.length} raw materials from Supabase`);
      return materials;
    } catch (error) {
      handleNetworkError(error, 'Fetching raw materials');
      return [];
    }
  },

  async addRawMaterial(material: RawMaterial): Promise<boolean> {
    console.log('📦 Adding raw material:', material.name);

    try {
      console.log('🌐 Sending to Supabase database...');
      
      // Include category, description, and monthly threshold
      const { error } = await supabase
        .from(RAW_MATERIALS_TABLE)
        .insert([{
          id: material.id,
          name: material.name,
          stock: material.stock,
          unit: material.unit,
          category: material.category || null,
          description: material.description || null,
          image_url: material.imageUrl,
          reorder_link: material.reorderLink,
          monthly_threshold: material.monthlyThreshold || null,
        }]);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        if (error.message.includes('description')) {
          console.error('📋 Run this SQL: ALTER TABLE raw_materials ADD COLUMN description TEXT;');
        }
        return false;
      }
      
      console.log('✅✅✅ Successfully saved with description to Supabase!');
      console.log('🎉 Material is now live in the database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Adding raw material');
      return false;
    }
  },

  async createRawMaterial(material: Omit<RawMaterial, 'id'>): Promise<RawMaterial> {
    const newMaterial: RawMaterial = {
      ...material,
      id: `raw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const success = await this.addRawMaterial(newMaterial);
    if (!success) {
      throw new Error('Failed to create raw material');
    }
    
    return newMaterial;
  },

  async updateRawMaterial(id: string, updates: Partial<RawMaterial>): Promise<RawMaterial> {
    console.log('📦 Updating raw material:', id);

    try {
      console.log('🌐 Updating Supabase database...');
      
      // Build update object dynamically
      const updateData: any = {};
      if (updates.stock !== undefined) updateData.stock = updates.stock;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.reorderLink !== undefined) updateData.reorder_link = updates.reorderLink;
      if (updates.monthlyThreshold !== undefined) updateData.monthly_threshold = updates.monthlyThreshold;
      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(RAW_MATERIALS_TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error.message);
        
        // Check for network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Network error: Unable to connect to database. Please check your internet connection.');
        }
        
        throw new Error(`Failed to update material: ${error.message}`);
      }
      
      if (!data) {
        console.error('❌ No data returned from update');
        throw new Error('Failed to update material: No data returned');
      }
      
      console.log('✅ Successfully updated database!');
      
      // Return the updated material in the app format
      return {
        id: data.id,
        name: data.name,
        stock: Number(data.stock),
        unit: data.unit,
        category: data.category || '',
        description: data.description || '',
        imageUrl: data.image_url,
        reorderLink: data.reorder_link,
        monthlyThreshold: data.monthly_threshold ? Number(data.monthly_threshold) : undefined,
      };
    } catch (error) {
      handleNetworkError(error, 'Updating raw material');
      throw error;
    }
  },

  async deleteRawMaterial(id: string): Promise<boolean> {
    console.log('📦 Deleting raw material:', id);

    try {
      console.log('🌐 Deleting from Supabase database...');
      
      const { error } = await supabase
        .from(RAW_MATERIALS_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return false;
      }
      
      console.log('✅ Successfully deleted from database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Deleting raw material');
      return false;
    }
  },

  async batchUpdateMaterials(updates: { id: string; stock: number }[]): Promise<boolean> {
    try {
      // Batch update in Supabase
      for (const update of updates) {
        await supabase
          .from(RAW_MATERIALS_TABLE)
          .update({ stock: update.stock, updated_at: new Date().toISOString() })
          .eq('id', update.id);
      }
      
      console.log('✅ Batch update successful!');
      return true;
    } catch (error) {
      console.warn('⚠️ Error in batch update:', error);
      return false;
    }
  },

  // ===================================
  // FINISHED PRODUCTS - DIRECT SUPABASE
  // ===================================
  
  async getFinishedProducts(): Promise<FinishedProduct[]> {
    try {
      console.log('📦 Fetching finished products from Supabase...');
      
      const { data, error } = await supabase
        .from(FINISHED_PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') {
          console.warn('⚠️ Database table not created yet');
          console.info('📋 Please run the SQL script in /supabase/init.sql');
        } else {
          console.warn('⚠️ Supabase error:', error.message);
        }
        return [];
      }
      
      // Convert database format to app format
      const products: FinishedProduct[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        subCategory: item.sub_category,
        gender: item.gender,
        stock: Number(item.stock),
        quantity: Number(item.stock), // Alias for stock
        billOfMaterials: item.bill_of_materials || [],
        imageUrl: item.image_url,
      }));
      
      console.log(`✅ Loaded ${products.length} finished products from Supabase`);
      return products;
    } catch (error) {
      handleNetworkError(error, 'Fetching finished products');
      return [];
    }
  },

  async addFinishedProduct(product: FinishedProduct): Promise<boolean> {
    console.log('📦 Adding finished product:', product.name);

    try {
      console.log('🌐 Sending to Supabase database...');
      
      const { error } = await supabase
        .from(FINISHED_PRODUCTS_TABLE)
        .insert([{
          id: product.id,
          name: product.name,
          category: product.category,
          sub_category: product.subCategory,
          gender: product.gender,
          stock: product.stock,
          bill_of_materials: product.billOfMaterials,
          image_url: product.imageUrl,
        }]);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return false;
      }
      
      console.log('✅✅✅ Successfully saved to Supabase database!');
      console.log('🎉 Product is now live in the database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Adding finished product');
      return false;
    }
  },

  async createFinishedProduct(product: Omit<FinishedProduct, 'id'>): Promise<FinishedProduct> {
    const newProduct: FinishedProduct = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const success = await this.addFinishedProduct(newProduct);
    if (!success) {
      throw new Error('Failed to create finished product');
    }
    
    return newProduct;
  },

  async updateFinishedProduct(id: string, updates: Partial<FinishedProduct>): Promise<FinishedProduct> {
    console.log('📦 Updating finished product:', id);

    try {
      console.log('🌐 Updating Supabase database...');
      
      // Build update object dynamically
      const updateData: any = {};
      if (updates.stock !== undefined) updateData.stock = updates.stock;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.subCategory !== undefined) updateData.sub_category = updates.subCategory;
      if (updates.gender !== undefined) updateData.gender = updates.gender;
      if (updates.billOfMaterials !== undefined) updateData.bill_of_materials = updates.billOfMaterials;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(FINISHED_PRODUCTS_TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error.message);
        throw new Error('Failed to update product');
      }
      
      console.log('✅ Successfully updated database!');
      
      // Return the updated product in the app format
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        subCategory: data.sub_category,
        gender: data.gender,
        stock: Number(data.stock),
        billOfMaterials: data.bill_of_materials || [],
        imageUrl: data.image_url,
      };
    } catch (error) {
      handleNetworkError(error, 'Updating finished product');
      throw error;
    }
  },

  async deleteFinishedProduct(id: string): Promise<boolean> {
    console.log('📦 Deleting finished product:', id);

    try {
      console.log('🌐 Deleting from Supabase database...');
      
      const { error } = await supabase
        .from(FINISHED_PRODUCTS_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return false;
      }
      
      console.log('✅ Successfully deleted from database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Deleting finished product');
      return false;
    }
  },

  // ===================================
  // PACKAGING MATERIALS - DIRECT SUPABASE
  // ===================================
  
  async getPackagingMaterials(): Promise<PackagingMaterial[]> {
    try {
      console.log('📦 Fetching packaging materials from Supabase...');
      
      const { data, error } = await supabase
        .from(PACKAGING_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') {
          console.warn('⚠️ Database table not created yet');
          console.info('📋 Please run the SQL script in /supabase/init.sql');
        } else {
          console.warn('⚠️ Supabase error:', error.message);
        }
        return [];
      }
      
      // Convert database format to app format
      const materials: PackagingMaterial[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        stock: Number(item.stock),
        quantity: Number(item.stock), // Alias for stock
        unit: item.unit,
        imageUrl: item.image_url,
        reorderLink: item.reorder_link,
        monthlyThreshold: item.monthly_threshold ? Number(item.monthly_threshold) : undefined,
      }));
      
      console.log(`✅ Loaded ${materials.length} packaging materials from Supabase`);
      return materials;
    } catch (error) {
      handleNetworkError(error, 'Fetching packaging materials');
      return [];
    }
  },

  async addPackagingMaterial(material: PackagingMaterial): Promise<boolean> {
    console.log('📦 Adding packaging material:', material.name);

    try {
      console.log('🌐 Sending to Supabase database...');
      
      const { error } = await supabase
        .from(PACKAGING_TABLE)
        .insert([{
          id: material.id,
          name: material.name,
          stock: material.stock,
          unit: material.unit,
          image_url: material.imageUrl,
          reorder_link: material.reorderLink,
        }]);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return false;
      }
      
      console.log('✅✅✅ Successfully saved to Supabase database!');
      console.log('🎉 Material is now live in the database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Adding packaging material');
      return false;
    }
  },

  async createPackagingMaterial(material: Omit<PackagingMaterial, 'id'>): Promise<PackagingMaterial> {
    const newMaterial: PackagingMaterial = {
      ...material,
      id: `packaging-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const success = await this.addPackagingMaterial(newMaterial);
    if (!success) {
      throw new Error('Failed to create packaging material');
    }
    
    return newMaterial;
  },

  async updatePackagingMaterial(id: string, updates: Partial<PackagingMaterial>): Promise<PackagingMaterial> {
    console.log('📦 Updating packaging material:', id);

    try {
      console.log('🌐 Updating Supabase database...');
      
      // Build update object dynamically
      const updateData: any = {};
      if (updates.stock !== undefined) updateData.stock = updates.stock;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.reorderLink !== undefined) updateData.reorder_link = updates.reorderLink;
      if (updates.monthlyThreshold !== undefined) updateData.monthly_threshold = updates.monthlyThreshold;
      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(PACKAGING_TABLE)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error.message);
        throw new Error('Failed to update packaging material');
      }
      
      console.log('✅ Successfully updated database!');
      
      // Return the updated material in the app format
      return {
        id: data.id,
        name: data.name,
        stock: Number(data.stock),
        unit: data.unit,
        imageUrl: data.image_url,
        reorderLink: data.reorder_link,
        monthlyThreshold: data.monthly_threshold ? Number(data.monthly_threshold) : undefined,
      };
    } catch (error) {
      handleNetworkError(error, 'Updating packaging material');
      throw error;
    }
  },

  async deletePackagingMaterial(id: string): Promise<boolean> {
    console.log('📦 Deleting packaging material:', id);

    try {
      console.log('🌐 Deleting from Supabase database...');
      
      const { error } = await supabase
        .from(PACKAGING_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return false;
      }
      
      console.log('✅ Successfully deleted from database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Deleting packaging material');
      return false;
    }
  },

  // ===================================
  // ACTIVITY LOGS - DIRECT SUPABASE
  // ===================================
  
  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      console.log('📦 Fetching activity logs from Supabase...');
      
      // Limit to recent 1000 logs to prevent timeout
      const { data, error } = await supabase
        .from(ACTIVITY_LOGS_TABLE)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);
      
      if (error) {
        if (error.code === '42P01') {
          console.warn('⚠️ Database table not created yet');
          console.info('📋 Please run the SQL script in /supabase/init.sql');
        } else {
          console.warn('⚠️ Supabase error:', error.message);
        }
        return [];
      }
      
      // Convert database format to app format
      const logs: ActivityLog[] = (data || []).map((item: any) => {
        // Parse affected_materials if it's a JSON string
        let affectedMaterials = item.affected_materials;
        if (typeof affectedMaterials === 'string') {
          try {
            affectedMaterials = JSON.parse(affectedMaterials);
          } catch (e) {
            console.warn('Failed to parse affected_materials:', e);
            affectedMaterials = undefined;
          }
        }

        const log = {
          id: item.id,
          timestamp: new Date(item.timestamp),
          action: item.action,
          quantity: item.quantity ? Number(item.quantity) : undefined,
          productName: item.product_name,
          materialName: item.material_name,
          packagingName: item.packaging_name,
          affectedMaterials: affectedMaterials,
          description: item.description,
          previousStock: item.previous_stock ? Number(item.previous_stock) : undefined,
          newStock: item.new_stock ? Number(item.new_stock) : undefined,
        };

        // Log PRODUCT_DEDUCTED entries for debugging
        if (log.action === 'PRODUCT_DEDUCTED') {
          console.log('🔍 Loaded PRODUCT_DEDUCTED log:', {
            productName: log.productName,
            quantity: log.quantity,
            affectedMaterials: log.affectedMaterials
          });
        }

        return log;
      });
      
      console.log(`✅ Loaded ${logs.length} activity logs from Supabase (limited to last 1000)`);
      return logs;
    } catch (error) {
      handleNetworkError(error, 'Fetching activity logs');
      return [];
    }
  },

  async addActivityLog(log: ActivityLog): Promise<boolean> {
    console.log('📦 Adding activity log:', log.action);
    console.log('📦 Log details:', {
      productName: log.productName,
      materialName: log.materialName,
      packagingName: log.packagingName,
      quantity: log.quantity,
      affectedMaterials: log.affectedMaterials
    });

    try {
      console.log('🌐 Sending to Supabase database...');
      
      const { error } = await supabase
        .from(ACTIVITY_LOGS_TABLE)
        .insert([{
          id: log.id,
          timestamp: log.timestamp.toISOString(),
          action: log.action,
          quantity: log.quantity,
          product_name: log.productName,
          material_name: log.materialName,
          packaging_name: log.packagingName,
          affected_materials: log.affectedMaterials,
          description: log.description,
          previous_stock: log.previousStock,
          new_stock: log.newStock,
        }]);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        
        // Provide helpful error message if columns are missing
        if (error.message.includes('new_stock') || error.message.includes('previous_stock')) {
          console.error('❌ ========================================');
          console.error('❌ MISSING DATABASE COLUMNS ERROR');
          console.error('❌ ========================================');
          console.error('❌ The activity_logs table is missing columns:');
          console.error('❌   - previous_stock');
          console.error('❌   - new_stock');
          console.error('❌');
          console.error('❌ SOLUTION: Run this SQL in Supabase SQL Editor:');
          console.error('❌');
          console.error('ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS previous_stock NUMERIC;');
          console.error('ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS new_stock NUMERIC;');
          console.error('❌');
          console.error('❌ See /SQL_ADD_STOCK_COLUMNS.sql for details');
          console.error('❌ ========================================');
        }
        
        return false;
      }
      
      console.log('✅✅✅ Successfully saved to Supabase database!');
      console.log('🎉 Log is now live in the database!');
      return true;
    } catch (error) {
      handleNetworkError(error, 'Adding activity log');
      return false;
    }
  },

  async createActivityLog(log: Omit<ActivityLog, 'id'>): Promise<ActivityLog> {
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
    };
    
    const success = await this.addActivityLog(newLog);
    if (!success) {
      throw new Error('Failed to create activity log');
    }
    
    return newLog;
  },
};