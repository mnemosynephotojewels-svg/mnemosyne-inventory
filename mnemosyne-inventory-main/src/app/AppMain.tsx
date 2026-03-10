/**
 * MAIN APPLICATION COMPONENT
 * 
 * This is the full Mnemosyne application with all features.
 * Only loaded when NOT on the reset password page to avoid figma:asset loading issues.
 */

import { useState, useEffect } from 'react';
import { Loader2, Settings, User, LogOut, LayoutDashboard, Package, PackageOpen, Box, FileText, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './components/LoginPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ResetPasswordPageSimple } from './components/ResetPasswordPageSimple';
import { DashboardTab } from './components/DashboardTab';
import { FinishedProductsTab } from './components/FinishedProductsTab';
import { RawMaterialsTab } from './components/RawMaterialsTab';
import { ActivityLogTab } from './components/ActivityLogTab';
import { ReportsTab } from './components/ReportsTab';
import { PackagingMaterialsTab } from './components/PackagingMaterialsTab';
import { AccountSettingsPage } from './components/AccountSettingsPage';
import { api, testConnection } from './services/api';
import { FinishedProduct, RawMaterial, ActivityLog, PackagingMaterial } from './types/inventory';
import { toast } from 'sonner';
import logoImage from '../assets/logo.png';
import { motion } from 'motion/react';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './components/ui/dialog';
import { Footer } from './components/Footer';
import { runDatabaseDiagnostic } from './utils/testDatabase';
import { initEmailService } from './services/emailServiceEmailJS';

export default function AppMain() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [packagingMaterials, setPackagingMaterials] = useState<PackagingMaterial[]>([]);
  const [finishedProducts, setFinishedProducts] = useState<FinishedProduct[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Load active tab from localStorage, default to 'dashboard'
  const [activeTab, setActiveTab] = useState(() => {
  const savedTab = localStorage.getItem('mnemosyne_active_tab');
  return savedTab || 'dashboard';
});
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedPackagingId, setSelectedPackagingId] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Check if we're on the reset password page - use state to ensure proper reactivity
  const [isResetPasswordPage, setIsResetPasswordPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('token');
  });

// Check authentication state from localStorage on mount
  useEffect(() => {
  const checkAuth = () => {
    const isAuth = localStorage.getItem('mnemosyne_authenticated') === 'true';
    console.log('🔐 Checking authentication from localStorage:', isAuth);
    setIsAuthenticated(isAuth);
    setIsLoading(!isAuth); // Only show loading if authenticated
  };
  
  checkAuth();
}, []);

// Save active tab to localStorage whenever it changes
useEffect(() => {
  if (isAuthenticated && activeTab) {
    localStorage.setItem('mnemosyne_active_tab', activeTab);
    console.log('📑 Active tab saved to localStorage:', activeTab);
  }
}, [activeTab, isAuthenticated]);
  // Check URL for reset password token on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasToken = urlParams.has('token');
    setIsResetPasswordPage(hasToken);
    
    if (hasToken) {
      console.log('🔑 PASSWORD RESET TOKEN DETECTED IN URL');
      console.log('🔑 Token:', urlParams.get('token')?.substring(0, 10) + '...');
    }
  }, []);

  // Initialize Email Service on mount
  useEffect(() => {
    initEmailService();
  }, []);

  // Debug logging for reset password page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasToken = urlParams.has('token');
    const tokenValue = urlParams.get('token');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 APP.TSX - URL ANALYSIS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Full URL:', window.location.href);
    console.log('📍 Pathname:', window.location.pathname);
    console.log(' Search:', window.location.search);
    console.log('📍 Hash:', window.location.hash);
    console.log('🎫 Has Token Param:', hasToken);
    console.log('🎫 Token Value:', tokenValue ? `${tokenValue.substring(0, 10)}... (length: ${tokenValue.length})` : 'NO TOKEN');
    console.log('🎯 Is Reset Password Page:', isResetPasswordPage);
    console.log('🔐 Is Authenticated:', isAuthenticated);
    console.log('⏳ Is Loading:', isLoading);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (isResetPasswordPage) {
      console.log('✅ RENDERING: ResetPasswordPage component');
    } else if (!isAuthenticated) {
      console.log('🔒 RENDERING: LoginPage component');
    } else if (isLoading) {
      console.log('⏳ RENDERING: Loading screen');
    } else {
      console.log('📊 RENDERING: Main dashboard');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n');
  }, [isResetPasswordPage, isAuthenticated, isLoading]);

  // Helper function to generate unique activity log IDs
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Load data from Supabase on mount (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        console.log('📊 Loading data from Supabase...');
        setIsLoading(true);

        const [rawMats, packMats, finProds, actLog] = await Promise.all([
          api.getRawMaterials(),
          api.getPackagingMaterials(),
          api.getFinishedProducts(),
          api.getActivityLogs(),
        ]);

        setRawMaterials(rawMats);
        setPackagingMaterials(packMats);
        setFinishedProducts(finProds);
        setActivityLog(actLog);
        
        setIsSupabaseConnected(true);
        console.log('✅ Data loaded successfully from Supabase!');
        console.log(`📦 Raw Materials: ${rawMats.length}`);
        console.log(`📦 Packaging Materials: ${packMats.length}`);
        console.log(`📦 Finished Products: ${finProds.length}`);
        console.log(`📋 Activity Logs: ${actLog.length}`);
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setIsSupabaseConnected(false);
        toast.error('Failed to load data from database');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Raw Material CRUD operations
  const addRawMaterial = async (material: Omit<RawMaterial, 'id'>) => {
    try {
      const newMaterial = await api.createRawMaterial(material);
      setRawMaterials([...rawMaterials, newMaterial]);
      
      const logEntry: Omit<ActivityLog, 'id'> = {
        timestamp: new Date(),
        action: 'MATERIAL_ADDED',
        materialName: material.name,
        quantity: material.stock,
        description: `Added "${material.name}"`,
      };
      
      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);
      
      toast.success(`Added "${material.name}" to inventory`);
    } catch (error) {
      console.error('Error adding raw material:', error);
      toast.error('Failed to add raw material');
    }
  };

  const updateRawMaterial = async (id: string, stock: number) => {
    try {
      console.log('🔄 UPDATE RAW MATERIAL - AppMain');
      console.log('   ID:', id);
      console.log('   New stock value:', stock);
      
      const existingMaterial = rawMaterials.find(m => m.id === id);
      if (!existingMaterial) {
        console.error('❌ Material not found:', id);
        return;
      }

      console.log('   Found material:', existingMaterial.name);
      console.log('   Old stock:', existingMaterial.stock);
      console.log('   Calling API to update...');

      const updatedMaterial = await api.updateRawMaterial(id, { stock });
      
      console.log('   ✅ API returned:', updatedMaterial);
      console.log('   Updated stock:', updatedMaterial.stock);
      
      setRawMaterials(rawMaterials.map(m => m.id === id ? updatedMaterial : m));

      const logEntry: Omit<ActivityLog, 'id'> = {
        timestamp: new Date(),
        action: 'MATERIAL_ADDED',
        materialName: existingMaterial.name,
        quantity: stock - existingMaterial.stock,
        description: `Updated \"${existingMaterial.name}\"`,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      console.log('✅ Update complete!');
      toast.success(`Updated \"${existingMaterial.name}\"`);
    } catch (error) {
      console.error('❌ Error updating raw material:', error);
      toast.error('Failed to update raw material');
    }
  };

  const deleteRawMaterial = async (id: string) => {
    try {
      const material = rawMaterials.find(m => m.id === id);
      if (!material) return;

      await api.deleteRawMaterial(id);
      setRawMaterials(rawMaterials.filter(m => m.id !== id));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Deleted Raw Material',
        details: `Deleted "${material.name}"`,
        category: 'raw_material',
        item_id: id,
        quantity_change: -material.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Deleted "${material.name}"`);
    } catch (error) {
      console.error('Error deleting raw material:', error);
      toast.error('Failed to delete raw material');
    }
  };

  const editRawMaterial = async (id: string, material: Omit<RawMaterial, 'id'>) => {
    try {
      const existingMaterial = rawMaterials.find(m => m.id === id);
      if (!existingMaterial) return;

      const updatedMaterial = await api.updateRawMaterial(id, material);
      setRawMaterials(rawMaterials.map(m => m.id === id ? updatedMaterial : m));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Edited Raw Material',
        details: `Edited \"${material.name}\"`,
        category: 'raw_material',
        item_id: id,
        quantity_change: material.quantity - existingMaterial.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Edited \"${material.name}\"`);
    } catch (error) {
      console.error('Error editing raw material:', error);
      toast.error('Failed to edit raw material');
    }
  };

  const deductRawMaterial = async (id: string, quantity: number, description: string) => {
    try {
      const material = rawMaterials.find(m => m.id === id);
      if (!material) return;

      const previousStock = material.stock;
      const newStock = material.stock - quantity;
      const updatedMaterial = await api.updateRawMaterial(id, { stock: newStock });
      setRawMaterials(rawMaterials.map(m => m.id === id ? updatedMaterial : m));

      const logEntry: Omit<ActivityLog, 'id'> = {
        timestamp: new Date(),
        action: 'MATERIAL_DEDUCTED',
        materialName: material.name,
        quantity: quantity,
        description: description || `Deducted ${quantity} ${material.unit} of "${material.name}"`,
        previousStock: previousStock,
        newStock: newStock,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Deducted ${quantity} ${material.unit} of "${material.name}"`);
    } catch (error) {
      console.error('Error deducting raw material:', error);
      toast.error('Failed to deduct raw material');
    }
  };

  // Packaging Material CRUD operations
  const addPackagingMaterial = async (material: Omit<PackagingMaterial, 'id'>) => {
    try {
      const newMaterial = await api.createPackagingMaterial(material);
      setPackagingMaterials([...packagingMaterials, newMaterial]);
      
      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Added Packaging Material',
        details: `Added "${material.name}"`,
        category: 'packaging_material',
        item_id: newMaterial.id,
        quantity_change: material.quantity,
      };
      
      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);
      
      toast.success(`Added "${material.name}" to inventory`);
    } catch (error) {
      console.error('Error adding packaging material:', error);
      toast.error('Failed to add packaging material');
    }
  };

  const updatePackagingMaterial = async (id: string, updates: Partial<PackagingMaterial>) => {
    try {
      console.log('🔄 UPDATE PACKAGING MATERIAL - AppMain');
      console.log('   ID:', id);
      console.log('   Updates:', updates);
      
      const existingMaterial = packagingMaterials.find(m => m.id === id);
      if (!existingMaterial) {
        console.error('❌ Material not found:', id);
        return;
      }

      console.log('   Found material:', existingMaterial.name);
      console.log('   Old stock:', existingMaterial.stock);
      console.log('   Calling API to update...');

      const updatedMaterial = await api.updatePackagingMaterial(id, updates);
      
      console.log('   ✅ API returned:', updatedMaterial);
      console.log('   Updated stock:', updatedMaterial.stock);
      
      setPackagingMaterials(packagingMaterials.map(m => m.id === id ? updatedMaterial : m));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Updated Packaging Material',
        details: `Updated \"${existingMaterial.name}\"`,
        category: 'packaging_material',
        item_id: id,
        quantity_change: updates.quantity ? updates.quantity - existingMaterial.quantity : 0,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      console.log('✅ Update complete!');
      toast.success(`Updated \"${existingMaterial.name}\"`);
    } catch (error) {
      console.error('❌ Error updating packaging material:', error);
      toast.error('Failed to update packaging material');
    }
  };

  // Wrapper function for simple stock updates from PackagingMaterialsTab
  const updatePackagingMaterialStock = async (id: string, stock: number) => {
    try {
      console.log('📦 UPDATE PACKAGING STOCK - Wrapper');
      console.log('   ID:', id);
      console.log('   New stock value:', stock);
      
      await updatePackagingMaterial(id, { stock });
    } catch (error) {
      console.error('❌ Error in updatePackagingMaterialStock wrapper:', error);
      throw error;
    }
  };

  const deletePackagingMaterial = async (id: string) => {
    try {
      const material = packagingMaterials.find(m => m.id === id);
      if (!material) return;

      await api.deletePackagingMaterial(id);
      setPackagingMaterials(packagingMaterials.filter(m => m.id !== id));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Deleted Packaging Material',
        details: `Deleted "${material.name}"`,
        category: 'packaging_material',
        item_id: id,
        quantity_change: -material.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Deleted "${material.name}"`);
    } catch (error) {
      console.error('Error deleting packaging material:', error);
      toast.error('Failed to delete packaging material');
    }
  };

  const editPackagingMaterial = async (id: string, material: Omit<PackagingMaterial, 'id'>) => {
    try {
      const existingMaterial = packagingMaterials.find(m => m.id === id);
      if (!existingMaterial) return;

      const updatedMaterial = await api.updatePackagingMaterial(id, material);
      setPackagingMaterials(packagingMaterials.map(m => m.id === id ? updatedMaterial : m));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Edited Packaging Material',
        details: `Edited "${material.name}"`,
        category: 'packaging_material',
        item_id: id,
        quantity_change: material.quantity - existingMaterial.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Edited "${material.name}"`);
    } catch (error) {
      console.error('Error editing packaging material:', error);
      toast.error('Failed to edit packaging material');
    }
  };

  const deductPackagingMaterial = async (id: string, quantity: number, description: string) => {
    try {
      const material = packagingMaterials.find(m => m.id === id);
      if (!material) return;

      const newStock = material.stock - quantity;
      const updatedMaterial = await api.updatePackagingMaterial(id, { stock: newStock });
      setPackagingMaterials(packagingMaterials.map(m => m.id === id ? updatedMaterial : m));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Deducted Packaging Material',
        details: description || `Deducted ${quantity} ${material.unit} of \"${material.name}\"`,
        category: 'packaging_material',
        item_id: id,
        quantity_change: -quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Deducted ${quantity} ${material.unit} of \"${material.name}\"`);
    } catch (error) {
      console.error('Error deducting packaging material:', error);
      toast.error('Failed to deduct packaging material');
    }
  };

  // Finished Product CRUD operations
  const addFinishedProduct = async (product: Omit<FinishedProduct, 'id'>) => {
    try {
      const newProduct = await api.createFinishedProduct(product);
      setFinishedProducts([...finishedProducts, newProduct]);

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Added Finished Product',
        details: `Added "${product.name}" x${product.quantity}`,
        category: 'finished_product',
        item_id: newProduct.id,
        quantity_change: product.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Added "${product.name}" to inventory`);
    } catch (error) {
      console.error('Error adding finished product:', error);
      toast.error('Failed to add finished product');
    }
  };

  const updateFinishedProduct = async (id: string, updates: Partial<FinishedProduct>) => {
    try {
      const existingProduct = finishedProducts.find(p => p.id === id);
      if (!existingProduct) return;

      const updatedProduct = await api.updateFinishedProduct(id, updates);
      setFinishedProducts(finishedProducts.map(p => p.id === id ? updatedProduct : p));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Updated Finished Product',
        details: `Updated "${existingProduct.name}"`,
        category: 'finished_product',
        item_id: id,
        quantity_change: updates.quantity ? updates.quantity - existingProduct.quantity : 0,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Updated "${existingProduct.name}"`);
    } catch (error) {
      console.error('Error updating finished product:', error);
      toast.error('Failed to update finished product');
    }
  };

  const deleteFinishedProduct = async (id: string) => {
    try {
      const product = finishedProducts.find(p => p.id === id);
      if (!product) return;

      await api.deleteFinishedProduct(id);
      setFinishedProducts(finishedProducts.filter(p => p.id !== id));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Deleted Finished Product',
        details: `Deleted "${product.name}"`,
        category: 'finished_product',
        item_id: id,
        quantity_change: -product.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Deleted "${product.name}"`);
    } catch (error) {
      console.error('Error deleting finished product:', error);
      toast.error('Failed to delete finished product');
    }
  };

  const handleUseFinishedProduct = async (productId: string, quantityUsed: number) => {
    try {
      const product = finishedProducts.find(p => p.id === productId);
      if (!product) return;

      // Don't update finished product here - that's handled by handleAddFinishedProductStock
      // This function only deducts raw materials

      const updatedRawMaterials = [...rawMaterials];
      const updatedPackagingMaterials = [...packagingMaterials];
      const deductionLogs: ActivityLog[] = [];
      const affectedMaterials: { materialName: string; quantity: number }[] = [];

      console.log('🔧 Processing bill of materials for:', product.name);
      console.log('📋 BOM:', product.billOfMaterials);

      if (product.billOfMaterials && product.billOfMaterials.length > 0) {
        for (const bom of product.billOfMaterials) {
          const totalDeduction = bom.quantity * quantityUsed;
          const materialId = bom.materialId || bom.material_id;
          
          console.log(`📦 Processing material: ${materialId}, quantity: ${bom.quantity} x ${quantityUsed} = ${totalDeduction}`);
          
          if (!materialId) {
            console.warn('⚠️ No materialId found in BOM item:', bom);
            continue;
          }
          
          // Try to find in raw materials first
          const rawMaterialIndex = updatedRawMaterials.findIndex(m => m.id === materialId);
          if (rawMaterialIndex !== -1) {
            const rawMaterial = updatedRawMaterials[rawMaterialIndex];
            const newStock = rawMaterial.stock - totalDeduction;
            
            console.log(`✅ Found raw material: ${rawMaterial.name}`);
            console.log(`📊 Current stock: ${rawMaterial.stock}, Deducting: ${totalDeduction}, New stock: ${newStock}`);
            
            updatedRawMaterials[rawMaterialIndex] = {
              ...rawMaterial,
              stock: newStock,
              quantity: newStock,
            };

            await api.updateRawMaterial(rawMaterial.id, { stock: newStock });

            const deductionLog: ActivityLog = {
              id: generateUniqueId(),
              timestamp: new Date().toISOString(),
              action: 'Deducted Raw Material',
              details: `Used ${totalDeduction} ${rawMaterial.unit} of "${rawMaterial.name}" (from ${product.name})`,
              category: 'raw_material',
              item_id: rawMaterial.id,
              quantity_change: -totalDeduction,
            };

            deductionLogs.push(deductionLog);
            
            // Track affected materials for the main product log
            affectedMaterials.push({
              materialName: rawMaterial.name,
              quantity: totalDeduction
            });
          } else {
            // Try to find in packaging materials
            const packagingMaterialIndex = updatedPackagingMaterials.findIndex(m => m.id === materialId);
            if (packagingMaterialIndex !== -1) {
              const packagingMaterial = updatedPackagingMaterials[packagingMaterialIndex];
              const newStock = packagingMaterial.stock - totalDeduction;
              
              console.log(`✅ Found packaging material: ${packagingMaterial.name}`);
              console.log(`📊 Current stock: ${packagingMaterial.stock}, Deducting: ${totalDeduction}, New stock: ${newStock}`);
              
              updatedPackagingMaterials[packagingMaterialIndex] = {
                ...packagingMaterial,
                stock: newStock,
                quantity: newStock,
              };

              await api.updatePackagingMaterial(packagingMaterial.id, { stock: newStock });

              const deductionLog: ActivityLog = {
                id: generateUniqueId(),
                timestamp: new Date().toISOString(),
                action: 'Deducted Packaging Material',
                details: `Used ${totalDeduction} ${packagingMaterial.unit} of "${packagingMaterial.name}" (from ${product.name})`,
                category: 'packaging_material',
                item_id: packagingMaterial.id,
                quantity_change: -totalDeduction,
              };

              deductionLogs.push(deductionLog);
              
              // Track affected materials for the main product log
              affectedMaterials.push({
                materialName: packagingMaterial.name,
                quantity: totalDeduction
              });
            } else {
              console.warn(`⚠️ Material not found: ${materialId}`);
            }
          }
        }
      }

      console.log(`✅ Updating ${updatedRawMaterials.length} raw materials in state`);
      setRawMaterials(updatedRawMaterials);
      setPackagingMaterials(updatedPackagingMaterials);

      console.log(`📝 Creating ${deductionLogs.length} activity logs`);
      for (const log of deductionLogs) {
        const savedLog = await api.createActivityLog(log);
        setActivityLog(prev => [savedLog, ...prev]);
      }

      // Create main product deduction log
      console.log('📝 Creating main PRODUCT_DEDUCTED log...');
      const mainProductLog: Omit<ActivityLog, 'id'> = {
        timestamp: new Date(),
        action: 'PRODUCT_DEDUCTED',
        productName: product.name,
        quantity: quantityUsed,
        affectedMaterials: affectedMaterials,
        description: `Used ${quantityUsed} unit${quantityUsed !== 1 ? 's' : ''} of "${product.name}"${affectedMaterials.length > 0 ? ` (${affectedMaterials.length} material${affectedMaterials.length !== 1 ? 's' : ''} deducted)` : ''}`,
      };

      const savedMainLog = await api.createActivityLog(mainProductLog);
      setActivityLog(prev => [savedMainLog, ...prev]);
      console.log('✅ Main PRODUCT_DEDUCTED log created');

      console.log('✅ Material deduction complete');
    } catch (error) {
      console.error('❌ Error using finished product:', error);
      toast.error('Failed to use finished product');
      throw error;
    }
  };

  const handleDeductFinishedProduct = async (productId: string, quantity: number, addOnMaterialId?: string, addOnQuantities?: { [materialId: string]: number }) => {
    try {
      console.log('🎯 ========================================');
      console.log('🎯 STARTING DEDUCTION PROCESS');
      console.log('🎯 Product ID:', productId);
      console.log('🎯 Quantity to produce:', quantity);
      console.log('🎯 Add-on quantities:', addOnQuantities);
      console.log('🎯 ========================================');
      
      const product = finishedProducts.find(p => p.id === productId);
      if (!product) {
        console.error('❌ Product not found!');
        toast.error('Product not found');
        return;
      }
      
      console.log('📦 Product found:', product.name);
      console.log('📋 Bill of Materials:', JSON.stringify(product.billOfMaterials, null, 2));
      
      if (!product.billOfMaterials || product.billOfMaterials.length === 0) {
        console.warn('⚠️ No bill of materials found for this product');
        toast.error('This product has no bill of materials configured');
        return;
      }

      // Create a copy of current materials to update
      const rawMaterialsToUpdate: { id: string; newStock: number }[] = [];
      const deductionLogs: ActivityLog[] = [];
      const affectedMaterials: { materialName: string; quantity: number }[] = [];

      // Process each BOM item
      for (const bom of product.billOfMaterials) {
        const materialId = bom.materialId || bom.material_id;
        const totalDeduction = bom.quantity * quantity;
        
        console.log('🔍 Processing BOM item:');
        console.log('   - materialId:', materialId);
        console.log('   - quantity per unit:', bom.quantity);
        console.log('   - total deduction:', totalDeduction);
        
        if (!materialId) {
          console.warn('⚠️ BOM item missing materialId:', bom);
          continue;
        }
        
        // Find the raw material
        const rawMaterial = rawMaterials.find(m => m.id === materialId);
        
        if (!rawMaterial) {
          console.error(`❌ Material not found with ID: ${materialId}`);
          toast.error(`Material not found: ${materialId}`);
          continue;
        }
        
        console.log(`✅ Found material: ${rawMaterial.name}`);
        console.log(`   - Current stock: ${rawMaterial.stock}`);
        console.log(`   - Will deduct: ${totalDeduction}`);
        console.log(`   - New stock will be: ${rawMaterial.stock - totalDeduction}`);
        
        // Check if sufficient stock
        if (rawMaterial.stock < totalDeduction) {
          const errorMsg = `Insufficient stock for ${rawMaterial.name}. Need ${totalDeduction}, have ${rawMaterial.stock}`;
          console.error('❌', errorMsg);
          toast.error(errorMsg);
          return;
        }
        
        // Calculate new stock
        const newStock = rawMaterial.stock - totalDeduction;
        
        // Add to update list
        rawMaterialsToUpdate.push({
          id: rawMaterial.id,
          newStock: newStock
        });
        
        // Track affected materials for the main product log
        affectedMaterials.push({
          materialName: rawMaterial.name,
          quantity: totalDeduction
        });
      }
      
      // Process add-ons
      if (addOnQuantities) {
        console.log('🎁 Processing add-ons...');
        for (const [materialId, addOnQty] of Object.entries(addOnQuantities)) {
          if (addOnQty > 0) {
            const rawMaterial = rawMaterials.find(m => m.id === materialId);
            
            if (!rawMaterial) {
              console.error(`❌ Add-on material not found: ${materialId}`);
              continue;
            }
            
            console.log(`🎁 Add-on: ${rawMaterial.name}, quantity: ${addOnQty}`);
            
            if (rawMaterial.stock < addOnQty) {
              const errorMsg = `Insufficient stock for add-on ${rawMaterial.name}. Need ${addOnQty}, have ${rawMaterial.stock}`;
              console.error('❌', errorMsg);
              toast.error(errorMsg);
              return;
            }
            
            const newStock = rawMaterial.stock - addOnQty;
            
            rawMaterialsToUpdate.push({
              id: rawMaterial.id,
              newStock: newStock
            });
            
            // Add to affected materials with add-on marker
            affectedMaterials.push({
              materialName: `${rawMaterial.name} (Add-on)`,
              quantity: addOnQty
            });
            
            const deductionLog: ActivityLog = {
              id: generateUniqueId(),
              timestamp: new Date().toISOString(),
              action: 'Deducted Raw Material',
              details: `Used ${addOnQty} ${rawMaterial.unit} of \"${rawMaterial.name}\" (add-on for ${product.name})`,
              category: 'raw_material',
              item_id: rawMaterial.id,
              quantity_change: -addOnQty,
            };
            
            deductionLogs.push(deductionLog);
          }
        }
      }
      
      console.log('💾 ========================================');
      console.log('💾 UPDATING DATABASE');
      console.log('💾 Materials to update:', rawMaterialsToUpdate.length);
      console.log('💾 ========================================');
      
      // Update all materials in database
      for (const update of rawMaterialsToUpdate) {
        console.log(`💾 Updating ${update.id} to stock: ${update.newStock}`);
        try {
          await api.updateRawMaterial(update.id, { stock: update.newStock });
        } catch (updateError: any) {
          console.error(`❌ Failed to update material ${update.id}:`, updateError);
          
          // Check if it's a network error
          if (updateError.message?.includes('Network error') || updateError.message?.includes('Failed to fetch')) {
            toast.error('Network error: Please check your internet connection and try again.');
            throw new Error('Network connection lost. Please check your internet connection.');
          }
          
          // Re-throw with more context
          throw new Error(`Failed to update material in database: ${updateError.message}`);
        }
      }
      
      console.log('✅ Database updates complete');
      
      // Update local state
      console.log('🔄 Updating local state...');
      const updatedRawMaterials = rawMaterials.map(material => {
        const update = rawMaterialsToUpdate.find(u => u.id === material.id);
        if (update) {
          console.log(`🔄 Updating ${material.name}: ${material.stock} -> ${update.newStock}`);
          return {
            ...material,
            stock: update.newStock,
            quantity: update.newStock
          };
        }
        return material;
      });
      
      setRawMaterials(updatedRawMaterials);
      console.log('✅ Local state updated');
      
      // Create activity logs
      console.log('📝 Creating activity logs...');
      for (const log of deductionLogs) {
        await api.createActivityLog(log);
        setActivityLog(prev => [log, ...prev]);
      }
      console.log('✅ Activity logs created');
      
      // Create main product deduction log with affected materials
      console.log('📝 Creating main PRODUCT_DEDUCTED log...');
      const mainProductLog: Omit<ActivityLog, 'id'> = {
        timestamp: new Date(),
        action: 'PRODUCT_DEDUCTED',
        productName: product.name,
        quantity: quantity,
        affectedMaterials: affectedMaterials,
        description: `Produced ${quantity} units of "${product.name}" using ${affectedMaterials.length} raw material(s)`,
      };

      console.log('📝 Main Product Log Details:', JSON.stringify(mainProductLog, null, 2));
      const savedMainLog = await api.createActivityLog(mainProductLog);
      console.log('📝 Saved Main Log from API:', JSON.stringify(savedMainLog, null, 2));
      setActivityLog(prev => [savedMainLog, ...prev]);
      console.log('✅ Main PRODUCT_DEDUCTED log created with affected materials:', affectedMaterials);
      
      console.log('🎉 ========================================');
      console.log('🎉 DEDUCTION COMPLETE!');
      console.log('🎉 ========================================');
      
    } catch (error) {
      console.error('❌ ========================================');
      console.error('❌ ERROR IN DEDUCTION PROCESS');
      console.error('❌ Error:', error);
      console.error('❌ ========================================');
      toast.error('Failed to deduct materials');
      throw error;
    }
  };

  const handleAddFinishedProductStock = async (productId: string, quantity: number) => {
    try {
      const product = finishedProducts.find(p => p.id === productId);
      if (!product) return;

      const newQuantity = product.quantity + quantity;
      await updateFinishedProduct(productId, { quantity: newQuantity });

      toast.success(`Added ${quantity} units to "${product.name}"`);
    } catch (error) {
      console.error('Error adding finished product stock:', error);
      toast.error('Failed to add finished product stock');
    }
  };

  const handleEditFinishedProduct = async (id: string, product: Omit<FinishedProduct, 'id'>) => {
    try {
      const existingProduct = finishedProducts.find(p => p.id === id);
      if (!existingProduct) return;

      const updatedProduct = await api.updateFinishedProduct(id, product);
      setFinishedProducts(finishedProducts.map(p => p.id === id ? updatedProduct : p));

      const logEntry: ActivityLog = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        action: 'Edited Finished Product',
        details: `Edited "${product.name}"`,
        category: 'finished_product',
        item_id: id,
        quantity_change: product.quantity - existingProduct.quantity,
      };

      const savedLog = await api.createActivityLog(logEntry);
      setActivityLog([savedLog, ...activityLog]);

      toast.success(`Edited "${product.name}"`);
    } catch (error) {
      console.error('Error editing finished product:', error);
      toast.error('Failed to edit finished product');
    }
  };

  const handleLogout = () => {
  // Clear authentication from localStorage
  localStorage.removeItem('mnemosyne_authenticated');
  console.log('🔐 Authentication cleared from localStorage');
  
  setIsAuthenticated(false);
  setRawMaterials([]);
  setPackagingMaterials([]);
  setFinishedProducts([]);
  setActivityLog([]);
  setIsLoading(true);
  setIsInitialized(false);
  setActiveTab('dashboard');
  toast.success('Logged out successfully');
};


  // If on reset password page, show reset password component
  // THIS MUST BE CHECKED FIRST, BEFORE ANY OTHER RENDERING LOGIC
  if (isResetPasswordPage) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ RESET PASSWORD PAGE DETECTED');
    console.log('🔄 Rendering ResetPasswordPageSimple component...');
    console.log('🔄 isResetPasswordPage value:', isResetPasswordPage);
    console.log('🔄 Current URL:', window.location.href);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Simple test div to ensure SOMETHING renders
    return (
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        backgroundColor: '#0a2647',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '20px',
          maxWidth: '500px',
          width: '90%'
        }}>
          <h1 style={{ color: '#0a2647', marginBottom: '20px', textAlign: 'center' }}>
            Reset Password Page Loaded!
          </h1>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '20px' }}>
            If you see this, the routing is working correctly.
          </p>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', fontSize: '12px' }}>
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>Token:</strong> {new URLSearchParams(window.location.search).get('token')?.substring(0, 20)}...</p>
          </div>
          <div style={{ marginTop: '20px' }}>
            <ResetPasswordPageSimple />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
  return <LoginPage onLoginSuccess={() => {
    localStorage.setItem('mnemosyne_authenticated', 'true');
    setIsAuthenticated(true);
  }} />;
}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <img 
            src={logoImage} 
            alt="Mnemosyne Logo" 
            className="w-64 h-64"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-gray-200 shadow-sm" style={{ backgroundColor: '#002D62' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="Mnemosyne Logo" className="w-26 h-26 sm:w-32 sm:h-32" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold tracking-wide" style={{ color: '#C7A32F' }}>MNEMOSYNE</h1>
                <p className="text-lg sm:text-xl font-semibold tracking-wider" style={{ color: '#C7A32F' }}>INVENTORY</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Account Settings Button */}
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-2 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    style={{ 
                      backgroundColor: '#C7A32F',
                      borderColor: '#C7A32F',
                      color: '#002D62'
                    }}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-primary flex items-center gap-2">
                      <Settings className="h-6 w-6" />
                      Account Settings
                    </DialogTitle>
                    <DialogDescription>
                      Manage your account settings and preferences
                    </DialogDescription>
                  </DialogHeader>
                  <AccountSettingsPage onLogout={handleLogout} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Modern Tab Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsList className="inline-flex items-center justify-start w-full bg-white p-1.5 rounded-xl border border-gray-200 shadow-lg h-[52px]">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg transition-all duration-200 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 whitespace-nowrap h-[44px]"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="hidden sm:inline font-medium text-sm">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="finished" 
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg transition-all duration-200 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 whitespace-nowrap h-[44px]"
              >
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline font-medium text-sm">Finished Products</span>
              </TabsTrigger>
              <TabsTrigger 
                value="raw" 
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg transition-all duration-200 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 whitespace-nowrap h-[44px]"
              >
                <PackageOpen className="h-5 w-5" />
                <span className="hidden sm:inline font-medium text-sm">Raw Materials</span>
              </TabsTrigger>
              <TabsTrigger 
                value="packaging" 
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg transition-all duration-200 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 whitespace-nowrap h-[44px]"
              >
                <Box className="h-5 w-5" />
                <span className="hidden sm:inline font-medium text-sm">Packaging</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg transition-all duration-200 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 whitespace-nowrap h-[44px]"
              >
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline font-medium text-sm">Reports</span>
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg transition-all duration-200 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 whitespace-nowrap h-[44px]"
              >
                <History className="h-5 w-5" />
                <span className="hidden sm:inline font-medium text-sm">Activity Log</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="dashboard">
            <DashboardTab
              rawMaterials={rawMaterials}
              packagingMaterials={packagingMaterials}
              finishedProducts={finishedProducts}
              activityLog={activityLog}
              onNavigateToMaterial={(materialId) => {
                setActiveTab('raw');
                setSelectedMaterialId(materialId);
              }}
              onNavigateToPackaging={(packagingId) => {
                setActiveTab('packaging');
                setSelectedPackagingId(packagingId);
              }}
              onNavigateToFinished={() => {
                setActiveTab('finished');
              }}
              onNavigateToRaw={() => {
                setActiveTab('raw');
              }}
              onNavigateToActivity={() => {
                setActiveTab('activity');
              }}
            />
          </TabsContent>

          <TabsContent value="finished">
            <FinishedProductsTab
              finishedProducts={finishedProducts}
              rawMaterials={rawMaterials}
              onAddProduct={addFinishedProduct}
              onDeductProduct={handleDeductFinishedProduct}
              onAddProductStock={handleAddFinishedProductStock}
              onEditProduct={handleEditFinishedProduct}
              onDeleteProduct={deleteFinishedProduct}
            />
          </TabsContent>

          <TabsContent value="raw">
            <RawMaterialsTab
              rawMaterials={rawMaterials}
              finishedProducts={finishedProducts}
              onAddMaterial={addRawMaterial}
              onUpdateMaterial={updateRawMaterial}
              onEditMaterial={editRawMaterial}
              onDeleteMaterial={deleteRawMaterial}
              onDeductMaterial={deductRawMaterial}
              selectedMaterialId={selectedMaterialId}
              onClearSelection={() => setSelectedMaterialId(null)}
            />
          </TabsContent>

          <TabsContent value="packaging">
            <PackagingMaterialsTab
              packagingMaterials={packagingMaterials}
              onAddMaterial={addPackagingMaterial}
              onUpdateMaterial={updatePackagingMaterialStock}
              onDeleteMaterial={deletePackagingMaterial}
              onEditMaterial={editPackagingMaterial}
              onDeductMaterial={deductPackagingMaterial}
              selectedPackagingId={selectedPackagingId}
              onClearSelection={() => setSelectedPackagingId(null)}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab
              rawMaterials={rawMaterials}
              packagingMaterials={packagingMaterials}
              finishedProducts={finishedProducts}
              activityLog={activityLog}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogTab activityLog={activityLog} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}