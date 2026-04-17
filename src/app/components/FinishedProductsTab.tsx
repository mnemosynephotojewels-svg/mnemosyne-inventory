import { useState } from 'react';
import { Plus, Minus, ArrowUp, Package2, Upload, X, Pencil, Trash2, ArrowRight, AlertCircle, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { FinishedProduct, RawMaterial } from '../types/inventory';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { motion, AnimatePresence } from 'motion/react';

interface FinishedProductsTabProps {
  finishedProducts: FinishedProduct[];
  rawMaterials: RawMaterial[];
  onAddProduct: (product: Omit<FinishedProduct, 'id'>) => void;
  onDeductProduct: (id: string, quantity: number, addOnMaterialId?: string, addOnQuantities?: { [materialId: string]: number }) => Promise<void>;
  onAddProductStock: (id: string, quantity: number) => Promise<void>;
  onEditProduct?: (id: string, product: Omit<FinishedProduct, 'id'>) => void;
  onDeleteProduct?: (id: string) => void;
}

// Category Configuration
const CATEGORY_CONFIG: { [key: string]: string[] } = {
  'Jewels Products': [
    'Engraved Photo Memory Necklace',
    'Photo Memory (Resin) Necklace',
    'Photo Memory Locket Necklace',
    'Engraved Bar Necklace',
    'Photo Memory Brooch',
    'Engraved Photo Keychain',
    'Engraved Bar Bracelet',
    'Engraved Photo Memory Bracelet',
    'Photo Memory (Resin) Bracelet',
    'Cufflinks'
  ],
  'Apparel Products': [
    'Photo Memory T-Shirt',
    'Photo Memory Tote Bag',
    'Minimalist Eye Shirt'
  ],
  'Decor Products': [
    'Photo Memory Lamp',
    'Photo Memory Wall Clock',
    'Photo Memory Mug',
    'Photo Memory Magnets',
    'Family Tree Display Sign'
  ]
};

export function FinishedProductsTab({
  finishedProducts,
  rawMaterials,
  onAddProduct,
  onDeductProduct,
  onAddProductStock,
  onEditProduct,
  onDeleteProduct,
}: FinishedProductsTabProps) {
  // Add Product Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [productCategory, setProductCategory] = useState('');
  const [productSubCategory, setProductSubCategory] = useState('');
  const [productGender, setProductGender] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [billOfMaterials, setBillOfMaterials] = useState<{ materialId: string; quantity: number }[]>([]);
  
  // Filter State
  const [filterMainCategory, setFilterMainCategory] = useState<string>('all');
  const [filterSubCategory, setFilterSubCategory] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  
  // Use Product Dialog State
  const [confirmUseDialogOpen, setConfirmUseDialogOpen] = useState(false);
  const [productToUse, setProductToUse] = useState<FinishedProduct | null>(null);
  const [productUseQuantity, setProductUseQuantity] = useState(1);
  const [addOnQuantities, setAddOnQuantities] = useState<{ [materialId: string]: number }>({});
  const [selectedAddOnToAdd, setSelectedAddOnToAdd] = useState<string>('');
  const [addedAddOns, setAddedAddOns] = useState<string[]>([]);
  
  // Edit Product Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FinishedProduct | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductCategory, setEditProductCategory] = useState('');
  const [editProductSubCategory, setEditProductSubCategory] = useState('');
  const [editProductGender, setEditProductGender] = useState('');
  const [editProductImageUrl, setEditProductImageUrl] = useState('');
  const [editBillOfMaterials, setEditBillOfMaterials] = useState<{ materialId: string; quantity: number }[]>([]);

  // Delete Product Dialog State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<FinishedProduct | null>(null);

  // Filter products based on selected filters
  const filteredProducts = finishedProducts.filter(product => {
    // Main category filter
    if (filterMainCategory !== 'all' && product.category !== filterMainCategory) {
      return false;
    }
    
    // Sub-category filter
    if (filterSubCategory !== 'all' && product.subCategory !== filterSubCategory) {
      return false;
    }
    
    // Gender filter (only for Jewels Products)
    if (filterGender !== 'all' && product.category === 'Jewels Products' && product.gender !== filterGender) {
      return false;
    }
    
    return true;
  });

  // Determine grouping strategy based on filters
  const shouldGroupByCategory = filterMainCategory === 'all' && filterSubCategory === 'all';
  const shouldGroupBySubCategory = filterMainCategory !== 'all' && filterSubCategory === 'all';
  
  // Group products hierarchically: Category → Sub-category → Products
  interface ProductHierarchy {
    [category: string]: {
      [subCategory: string]: FinishedProduct[];
    };
  }
  
  const hierarchicalProducts: ProductHierarchy = {};
  
  if (shouldGroupByCategory) {
    // Group by Category → Sub-category (All categories, All sub-categories)
    filteredProducts.forEach(product => {
      const category = product.category || 'Uncategorized';
      const subCategory = product.subCategory || 'Uncategorized';
      
      if (!hierarchicalProducts[category]) {
        hierarchicalProducts[category] = {};
      }
      if (!hierarchicalProducts[category][subCategory]) {
        hierarchicalProducts[category][subCategory] = [];
      }
      hierarchicalProducts[category][subCategory].push(product);
    });
  } else if (shouldGroupBySubCategory) {
    // Group by Sub-category only (when specific category is selected, all sub-categories)
    const selectedCategory = filterMainCategory;
    hierarchicalProducts[selectedCategory] = {};
    
    filteredProducts.forEach(product => {
      const subCategory = product.subCategory || 'Uncategorized';
      
      if (!hierarchicalProducts[selectedCategory][subCategory]) {
        hierarchicalProducts[selectedCategory][subCategory] = [];
      }
      hierarchicalProducts[selectedCategory][subCategory].push(product);
    });
  } else {
    // Flat list when specific filters are applied
    const category = filterMainCategory !== 'all' ? filterMainCategory : 'Filtered Products';
    const subCategory = filterSubCategory !== 'all' ? filterSubCategory : 'Products';
    hierarchicalProducts[category] = { [subCategory]: filteredProducts };
  }

  // Get available sub-categories based on main category filter
  const getAvailableSubCategories = (): string[] => {
    if (filterMainCategory === 'all') {
      // Return all sub-categories from all categories
      return Object.values(CATEGORY_CONFIG).flat();
    }
    return CATEGORY_CONFIG[filterMainCategory] || [];
  };

  // Handle main category filter change
  const handleMainCategoryFilterChange = (category: string) => {
    setFilterMainCategory(category);
    setFilterSubCategory('all'); // Reset sub-category when main category changes
    setFilterGender('all'); // Reset gender when main category changes
  };

  // Handle Add Product
  const handleAddProduct = () => {
    if (!productCategory.trim()) {
      toast.error('Please select a main category');
      return;
    }

    if (!productSubCategory.trim()) {
      toast.error('Please select a sub-category');
      return;
    }

    if (billOfMaterials.length === 0) {
      toast.error('Please add at least one material to the bill of materials');
      return;
    }

    onAddProduct({
      name: productSubCategory,
      category: productCategory,
      subCategory: productSubCategory,
      gender: productCategory === 'Jewels Products' ? productGender : '',
      stock: 0,
      billOfMaterials,
      imageUrl: productImageUrl.trim() || undefined,
    });

    toast.success(`Product "${productSubCategory}" added successfully`);
    resetAddForm();
  };

  const resetAddForm = () => {
    setProductCategory('');
    setProductSubCategory('');
    setProductGender('');
    setProductImageUrl('');
    setBillOfMaterials([]);
    setIsAddDialogOpen(false);
  };

  // BOM Management for Add Dialog
  const addMaterialToBOM = () => {
    if (rawMaterials.length === 0) {
      toast.error('Please add raw materials first');
      return;
    }
    setBillOfMaterials([...billOfMaterials, { materialId: rawMaterials[0].id, quantity: 1 }]);
  };

  const updateBOMMaterial = (index: number, materialId: string) => {
    const updated = [...billOfMaterials];
    updated[index].materialId = materialId;
    setBillOfMaterials(updated);
  };

  const updateBOMQuantity = (index: number, quantity: number) => {
    const updated = [...billOfMaterials];
    updated[index].quantity = quantity;
    setBillOfMaterials(updated);
  };

  const removeBOMMaterial = (index: number) => {
    setBillOfMaterials(billOfMaterials.filter((_, i) => i !== index));
  };

  // BOM Management for Edit Dialog
  const addEditMaterialToBOM = () => {
    if (rawMaterials.length === 0) {
      toast.error('Please add raw materials first');
      return;
    }
    setEditBillOfMaterials([...editBillOfMaterials, { materialId: rawMaterials[0].id, quantity: 1 }]);
  };

  const updateEditBOMMaterial = (index: number, materialId: string) => {
    const updated = [...editBillOfMaterials];
    updated[index].materialId = materialId;
    setEditBillOfMaterials(updated);
  };

  const updateEditBOMQuantity = (index: number, quantity: number) => {
    const updated = [...editBillOfMaterials];
    updated[index].quantity = quantity;
    setEditBillOfMaterials(updated);
  };

  const removeEditBOMMaterial = (index: number) => {
    setEditBillOfMaterials(editBillOfMaterials.filter((_, i) => i !== index));
  };

  // Image Upload Handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImageUrl(reader.result as string);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditProductImageUrl(reader.result as string);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => setProductImageUrl('');
  const removeEditImage = () => setEditProductImageUrl('');

  // Use Product Handlers
  const handleUse = (product: FinishedProduct) => {
    setProductToUse(product);
    setProductUseQuantity(1);
    setAddOnQuantities({});
    setConfirmUseDialogOpen(true);
  };

  const handleConfirmUse = async () => {
    if (!productToUse) return;

    const qty = productUseQuantity;

    // Validate quantity
    if (qty < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    // Check BOM materials stock
    for (const bom of productToUse.billOfMaterials) {
      const material = rawMaterials.find((m) => m.id === bom.materialId);
      const requiredQty = bom.quantity * qty;
      if (material && material.stock < requiredQty) {
        toast.error(`Insufficient stock for ${material.name}. Need ${requiredQty}, have ${material.stock}`);
        return;
      }
    }

    // Check add-ons stock (including Accessories)
    for (const [addOnId, addOnQty] of Object.entries(addOnQuantities)) {
      if (addOnQty > 0) {
        const addOnMaterial = rawMaterials.find((m) => m.id === addOnId);
        if (!addOnMaterial) {
          toast.error('Selected add-on material not found');
          return;
        }
        if (addOnMaterial.stock < addOnQty) {
          toast.error(`Insufficient stock for add-on: ${addOnMaterial.name}. Need ${addOnQty}, have ${addOnMaterial.stock}`);
          return;
        }
      }
    }

    // Build success message before resetting state
    const addOnsList = Object.entries(addOnQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([materialId, quantity]) => {
        const material = rawMaterials.find(m => m.id === materialId);
        return material ? `${quantity} ${material.name}` : null;
      })
      .filter(Boolean);

    const successMessage = addOnsList.length > 0
      ? `Produced ${qty} ${productToUse.name} with add-ons: ${addOnsList.join(', ')}`
      : `Produced ${qty} ${qty > 1 ? 'units' : 'unit'} of "${productToUse.name}"`;

    // Capture values before resetting state
    const capturedProductId = productToUse.id;
    const capturedAddOnQuantities = { ...addOnQuantities };

    // Close dialog and reset state immediately for better UX
    setConfirmUseDialogOpen(false);
    setProductToUse(null);
    setProductUseQuantity(1);
    setAddOnQuantities({});
    setSelectedAddOnToAdd('');
    setAddedAddOns([]);

    // Run deduction sequentially: raw materials (+ add-ons) FIRST, then add product stock
    // Sequential await prevents race conditions between the two async state updates
    await onDeductProduct(capturedProductId, qty, undefined, capturedAddOnQuantities);
    await onAddProductStock(capturedProductId, qty);

    toast.success(successMessage);
  };

  const handleCancelUse = () => {
    setConfirmUseDialogOpen(false);
    setProductToUse(null);
    setProductUseQuantity(1);
    setAddOnQuantities({});
    setSelectedAddOnToAdd('');
    setAddedAddOns([]);
  };

  // Add selected add-on to the list
  const handleAddAddOn = () => {
    if (selectedAddOnToAdd && !addedAddOns.includes(selectedAddOnToAdd)) {
      setAddedAddOns([...addedAddOns, selectedAddOnToAdd]);
      setAddOnQuantities({ ...addOnQuantities, [selectedAddOnToAdd]: 1 });
      setSelectedAddOnToAdd('');
    }
  };

  // Remove add-on from the list
  const handleRemoveAddOn = (materialId: string) => {
    setAddedAddOns(addedAddOns.filter(id => id !== materialId));
    const newQuantities = { ...addOnQuantities };
    delete newQuantities[materialId];
    setAddOnQuantities(newQuantities);
  };

  // Update add-on quantity
  const handleUpdateAddOnQuantity = (materialId: string, quantity: number) => {
    const material = rawMaterials.find(m => m.id === materialId);
    if (material) {
      const validQuantity = Math.min(material.stock, Math.max(1, quantity));
      setAddOnQuantities({ ...addOnQuantities, [materialId]: validQuantity });
    }
  };

  // Check if there are stock issues
  const hasStockIssues = () => {
    if (!productToUse) return false;
    
    // Check BOM materials
    for (const bom of productToUse.billOfMaterials) {
      const material = rawMaterials.find(m => m.id === bom.materialId);
      const requiredQty = bom.quantity * productUseQuantity;
      if (material && material.stock < requiredQty) {
        return true;
      }
    }
    
    // Check add-ons
    for (const [materialId, qty] of Object.entries(addOnQuantities)) {
      if (qty > 0) {
        const material = rawMaterials.find(m => m.id === materialId);
        if (material && material.stock < qty) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Get add-on materials (PENDANT, GLASS ONLY, and ACCESSORIES categories)
  const getAddOnMaterials = () => {
    return rawMaterials.filter(material => 
      material.category && 
      (material.category.toUpperCase().includes('PENDANT') || 
       material.category.toUpperCase().includes('GLASS ONLY') ||
       material.category.toUpperCase().includes('ACCESSORIES'))
    );
  };

  // Edit Product Handlers
  const handleEditProduct = (product: FinishedProduct) => {
    setEditingProduct(product);
    setEditProductName(product.name);
    setEditProductCategory(product.category || '');
    setEditProductSubCategory(product.subCategory || '');
    setEditProductGender(product.gender || '');
    setEditProductImageUrl(product.imageUrl || '');
    setEditBillOfMaterials(product.billOfMaterials);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditProduct = () => {
    if (!editingProduct) return;

    if (!editProductName.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    if (editBillOfMaterials.length === 0) {
      toast.error('Please add at least one material to the bill of materials');
      return;
    }

    onEditProduct!(editingProduct.id, {
      name: editProductName,
      category: editProductCategory,
      subCategory: editProductSubCategory,
      gender: editProductCategory === 'Jewels Products' ? editProductGender : '',
      stock: editingProduct.stock, // Keep existing stock
      billOfMaterials: editBillOfMaterials,
      imageUrl: editProductImageUrl.trim() || undefined,
    });

    toast.success(`Product "${editProductName}" updated successfully`);
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = (product: FinishedProduct) => {
    if (!onDeleteProduct) return;
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!onDeleteProduct || !productToDelete) return;
    onDeleteProduct(productToDelete.id);
    toast.success(`Product "${productToDelete.name}" deleted successfully`);
    setIsDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const cancelDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  // Helper Functions
  const getMaterialName = (materialId: string) => {
    return rawMaterials.find((m) => m.id === materialId)?.name || 'Unknown';
  };

  const calculateMaxProduction = (product: FinishedProduct): number => {
    if (product.billOfMaterials.length === 0) return 0;
    
    let maxUnits = Infinity;
    
    for (const bom of product.billOfMaterials) {
      const material = rawMaterials.find((m) => m.id === bom.materialId);
      if (!material) {
        maxUnits = 0;
        break;
      }
      
      const possibleUnits = Math.floor(material.stock / bom.quantity);
      maxUnits = Math.min(maxUnits, possibleUnits);
    }
    
    return maxUnits === Infinity ? 0 : maxUnits;
  };

  const getStockHealth = (product: FinishedProduct) => {
    const maxProduction = calculateMaxProduction(product);
    
    if (maxProduction === 0) {
      return {
        status: 'halted' as const,
        label: 'Production Halted',
        color: 'bg-red-500',
        IconComponent: AlertCircle
      };
    } else if (maxProduction < 5) {
      return {
        status: 'low' as const,
        label: 'Low Materials',
        color: 'bg-yellow-500',
        IconComponent: AlertTriangle
      };
    }
    
    return {
      status: 'healthy' as const,
      label: 'Healthy',
      color: 'bg-green-500',
      IconComponent: CheckCircle
    };
  };

  const isMaterialLowOrMissing = (materialId: string, requiredQty: number): boolean => {
    const material = rawMaterials.find((m) => m.id === materialId);
    if (!material) return true;
    return material.stock < requiredQty * 3;
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-secondary/20">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 pb-6 border-gray-200">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-2 tracking-tight">
              Finished Products
            </h2>
            <p className="text-gray-500 text-base">
              Manage your finished product inventory with elegance
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
                <Plus className="w-5 h-5" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Finished Product</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Add a new finished product with its bill of materials.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Product Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="product-image">Product Image</Label>
                  
                  {!productImageUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-secondary/50 transition-colors">
                      <label htmlFor="product-image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-16 h-16 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">Click to upload product image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </label>
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative border-2 border-secondary/30 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100/50">
                      <div className="flex items-center gap-4">
                        <img
                          src={productImageUrl}
                          alt="Product preview"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-secondary/20 shadow-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Image uploaded</p>
                          <p className="text-xs text-gray-500 mt-1">Preview shown</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={removeImage} className="flex items-center gap-1">
                          <X className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Category Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="product-category">Main Category</Label>
                  <select
                    id="product-category"
                    value={productCategory}
                    onChange={(e) => {
                      setProductCategory(e.target.value);
                      setProductSubCategory(''); // Reset sub-category when main category changes
                      // Clear gender if not Jewels Products
                      if (e.target.value !== 'Jewels Products') {
                        setProductGender('');
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                  >
                    <option value="">Select main category</option>
                    <option value="Jewels Products">Jewels Products</option>
                    <option value="Apparel Products">Apparel Products</option>
                    <option value="Decor Products">Decor Products</option>
                  </select>
                </div>

                {/* Sub-Category Dropdown */}
                {productCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="product-sub-category">Sub-Category</Label>
                    <select
                      id="product-sub-category"
                      value={productSubCategory}
                      onChange={(e) => setProductSubCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                    >
                      <option value="">Select sub-category</option>
                      {CATEGORY_CONFIG[productCategory]?.map((subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Gender Dropdown - Only for Jewels Products */}
                {productCategory === 'Jewels Products' && (
                  <div className="space-y-2">
                    <Label htmlFor="product-gender">Gender</Label>
                    <select
                      id="product-gender"
                      value={productGender}
                      onChange={(e) => setProductGender(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                    >
                      <option value="">Select gender</option>
                      <option value="MEN">MEN</option>
                      <option value="WOMEN">WOMEN</option>
                    </select>
                  </div>
                )}

                {/* Bill of Materials */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Bill of Materials</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMaterialToBOM}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Material
                    </Button>
                  </div>

                  {billOfMaterials.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed rounded-lg">
                      No materials added yet. Click "Add Material" to start.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {billOfMaterials.map((bom, index) => (
                        <div key={index} className="flex gap-2 items-end border p-3 rounded-lg bg-gray-50">
                          <div className="flex-1">
                            <Label className="text-xs">Material</Label>
                            <select
                              className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                              value={bom.materialId}
                              onChange={(e) => updateBOMMaterial(index, e.target.value)}
                            >
                              {rawMaterials.map((material) => (
                                <option key={material.id} value={material.id}>
                                  {material.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-32">
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={bom.quantity}
                              onChange={(e) => updateBOMQuantity(index, parseInt(e.target.value) || 1)}
                              className="mt-1"
                            />
                          </div>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeBOMMaterial(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleAddProduct} className="w-full">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Section */}
        <div className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-main-category" className="text-sm font-semibold text-gray-700">
                Main Category
              </Label>
              <select
                id="filter-main-category"
                value={filterMainCategory}
                onChange={(e) => handleMainCategoryFilterChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg bg-white hover:border-primary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none font-medium"
              >
                <option value="all">All Categories</option>
                <option value="Jewels Products">Jewels Products</option>
                <option value="Apparel Products">Apparel Products</option>
                <option value="Decor Products">Decor Products</option>
              </select>
            </div>

            {/* Sub-Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-sub-category" className="text-sm font-semibold text-gray-700">
                Sub-Category
              </Label>
              <select
                id="filter-sub-category"
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg bg-white hover:border-primary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none font-medium"
                disabled={filterMainCategory === 'all' && filteredProducts.length === 0}
              >
                <option value="all">All Sub-Categories</option>
                {getAvailableSubCategories().map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter - Only for Jewels Products */}
            {filterMainCategory === 'Jewels Products' && (
              <div className="space-y-2">
                <Label htmlFor="filter-gender" className="text-sm font-semibold text-gray-700">
                  Gender
                </Label>
                <select
                  id="filter-gender"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg bg-white hover:border-primary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none font-medium"
                >
                  <option value="all">All Genders</option>
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                </select>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {filterMainCategory !== 'all' && (
              <Badge className="bg-primary text-secondary">
                {filterMainCategory}
                <button
                  onClick={() => handleMainCategoryFilterChange('all')}
                  className="ml-2 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filterSubCategory !== 'all' && (
              <Badge className="bg-secondary text-primary">
                {filterSubCategory}
                <button
                  onClick={() => setFilterSubCategory('all')}
                  className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filterGender !== 'all' && (
              <Badge className="bg-purple-600 text-white">
                {filterGender}
                <button
                  onClick={() => setFilterGender('all')}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filterMainCategory === 'all' && filterSubCategory === 'all' && filterGender === 'all' && (
              <span className="text-sm text-gray-500 italic">No filters applied</span>
            )}
          </div>
        </div>

        {/* Products Grid - Hierarchical Display */}
        <div className="space-y-8">
          {Object.entries(hierarchicalProducts).map(([category, subCategories]) => {
            const totalProductsInCategory = Object.values(subCategories).reduce((sum, products) => sum + products.length, 0);
            if (totalProductsInCategory === 0) return null;
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Category Header - Only show when grouping by category */}
                {shouldGroupByCategory && (
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-secondary px-6 py-2 rounded-full shadow-md">
                      <h3 className="text-xl font-bold">{category}</h3>
                    </div>
                    <Badge className="bg-secondary/20 text-primary border-secondary/30 text-sm px-3 py-1">
                      {totalProductsInCategory} {totalProductsInCategory === 1 ? 'product' : 'products'}
                    </Badge>
                  </div>
                )}

                {/* Sub-categories within this category */}
                <div className="space-y-6">
                  {Object.entries(subCategories).map(([subCategory, products]) => {
                    if (products.length === 0) return null;
                    
                    return (
                      <motion.div
                        key={`${category}-${subCategory}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Sub-category Header */}
                        {(shouldGroupByCategory || shouldGroupBySubCategory) && (
                          <div className="flex items-center gap-3 pl-4 border-l-4 border-secondary/30 ml-2">
                            <div className="bg-gradient-to-r from-secondary to-secondary/90 text-primary px-5 py-1.5 rounded-full shadow-sm border-2 border-secondary/30">
                              <h4 className="text-base font-semibold">{subCategory}</h4>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-0.5">
                              {products.length} {products.length === 1 ? 'item' : 'items'}
                            </Badge>
                          </div>
                        )}

                        {/* Products Grid for this sub-category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-8">
                          {products.map((product, index) => {
                  const maxProduction = calculateMaxProduction(product);
                  const stockHealth = getStockHealth(product);
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 relative">
                        {/* Stock Health Badge - Top Left */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className={`${stockHealth.color} text-white font-semibold shadow-md flex items-center gap-1.5 px-3 py-1 text-xs`}>
                            <stockHealth.IconComponent className="w-3.5 h-3.5" />
                            {stockHealth.label}
                          </Badge>
                        </div>

                        {/* Edit Button - Top Right */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="absolute top-4 right-4 z-10 w-7 h-7 p-0 hover:bg-gray-200/80 transition-all"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </Button>
                        
                        {/* Product Image */}
                        {product.imageUrl && (
                          <div className="flex items-center justify-center mb-4 pt-8">
                            <ImageWithFallback
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-20 h-20 rounded-lg object-cover shadow-md"
                            />
                          </div>
                        )}

                        {/* Bill of Materials Display */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Package2 className="w-4 h-4 text-secondary" />
                            <span className="text-sm font-medium text-gray-700">Materials</span>
                            <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-600 text-xs">
                              {product.billOfMaterials.length} items
                            </Badge>
                          </div>
                          <ul className="space-y-2">
                            {product.billOfMaterials.map((bom, idx) => {
                              const material = rawMaterials.find(m => m.id === bom.materialId);
                              const isLow = isMaterialLowOrMissing(bom.materialId, bom.quantity);
                              
                              return (
                                <li
                                  key={idx}
                                  className={`text-sm px-3 py-2 rounded-md ${
                                    isLow ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium flex items-center gap-1">
                                      {getMaterialName(bom.materialId)}
                                      {isLow && <AlertCircle className="w-3 h-3" />}
                                    </span>
                                    <Badge variant="outline" className="bg-white border-gray-300 text-xs">
                                      ×{bom.quantity}
                                    </Badge>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Can Produce Badge */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Can produce:</span>
                          </div>
                          <Badge className={`${
                            maxProduction === 0 
                              ? 'bg-red-500' 
                              : maxProduction < 5 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          } text-white font-semibold text-xs`}>
                            {maxProduction} units
                          </Badge>
                        </div>

                        {/* Use Product Button */}
                        <Button
                          onClick={() => handleUse(product)}
                          disabled={maxProduction === 0}
                          className="w-full bg-primary hover:bg-primary/90 text-secondary py-5 text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Package2 className="w-4 h-4 mr-2" />
                          Use Product
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      );
    })}
  </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 bg-white/50">
            <CardContent className="py-16 text-center text-gray-500">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package2 className="w-12 h-12 text-primary/50" />
              </div>
              <p className="text-lg font-medium text-gray-700">
                {finishedProducts.length === 0 
                  ? 'No finished products yet'
                  : 'No products match the selected filters'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {finishedProducts.length === 0 
                  ? 'Click "Add Product" to get started with your inventory'
                  : 'Try adjusting your filters or add new products'}
              </p>
            </CardContent>
          </Card>
        )}

      {/* Use Product Confirmation Dialog */}
      <Dialog open={confirmUseDialogOpen} onOpenChange={setConfirmUseDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Package2 className="w-6 h-6 text-secondary" />
              Use Product
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              {productToUse && (
                <>
                  Produce <span className="font-semibold text-primary">"{productToUse.name}"</span> with automatic material deduction
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 overflow-y-auto flex-1 px-1">
            {/* Product Quantity Input */}
            <div className="space-y-3">
              <Label htmlFor="product-quantity" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package2 className="w-4 h-4 text-primary" />
                Quantity to Produce
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProductUseQuantity(Math.max(1, productUseQuantity - 1))}
                  className="h-10 w-10 p-0 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="product-quantity"
                  type="number"
                  min="1"
                  value={productUseQuantity}
                  onChange={(e) => setProductUseQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center text-lg font-bold border-2 border-primary/20 focus:border-secondary h-10"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProductUseQuantity(productUseQuantity + 1)}
                  className="h-10 w-10 p-0 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add-on Materials Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Add-on Materials
                  </Label>
                  <span className="text-[10px] text-gray-400 font-normal">Pendant & Glass · Accessories</span>
                  {addedAddOns.length > 0 && (
                    <Badge className="bg-secondary text-primary font-bold text-xs">
                      {addedAddOns.length}
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="bg-secondary/10 border-secondary/30 text-secondary text-xs">
                  Optional
                </Badge>
              </div>

              {/* Add-on Selector */}
              <div className="flex gap-2">
                <select
                  value={selectedAddOnToAdd}
                  onChange={(e) => setSelectedAddOnToAdd(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 border-2 border-primary/20 rounded-lg bg-white hover:border-primary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-sm"
                >
                  <option value="">Select material...</option>
                  {/* Pendant & Glass group */}
                  {getAddOnMaterials().filter(m => (m.category?.toUpperCase().includes('PENDANT') || m.category?.toUpperCase().includes('GLASS ONLY')) && !addedAddOns.includes(m.id)).length > 0 && (
                    <optgroup label="── Pendant & Glass ──">
                      {getAddOnMaterials()
                        .filter(m => (m.category?.toUpperCase().includes('PENDANT') || m.category?.toUpperCase().includes('GLASS ONLY')) && !addedAddOns.includes(m.id))
                        .map((material) => (
                          <option key={material.id} value={material.id} disabled={material.stock < 1}>
                            {material.name} — Stock: {material.stock}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {/* Accessories group */}
                  {getAddOnMaterials().filter(m => m.category?.toUpperCase().includes('ACCESSORIES') && !addedAddOns.includes(m.id)).length > 0 && (
                    <optgroup label="── Accessories ──">
                      {getAddOnMaterials()
                        .filter(m => m.category?.toUpperCase().includes('ACCESSORIES') && !addedAddOns.includes(m.id))
                        .map((material) => (
                          <option key={material.id} value={material.id} disabled={material.stock < 1}>
                            {material.name} — Stock: {material.stock}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
                <Button
                  type="button"
                  onClick={handleAddAddOn}
                  disabled={!selectedAddOnToAdd}
                  className="bg-secondary text-primary hover:bg-secondary/90 font-semibold px-4 flex-shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Added Add-ons List */}
              {addedAddOns.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Selected Add-ons</p>
                  <AnimatePresence mode="popLayout">
                    {addedAddOns.map((materialId) => {
                    const material = rawMaterials.find(m => m.id === materialId);
                    if (!material) return null;
                    const currentQty = addOnQuantities[materialId] || 1;
                    const hasInsufficientStock = currentQty > material.stock;
                    
                    return (
                      <motion.div
                        key={materialId}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`bg-gradient-to-r ${
                          hasInsufficientStock 
                            ? 'from-red-50 to-red-100/50 border-red-300' 
                            : 'from-secondary/10 to-secondary/5 border-secondary/30'
                        } border-2 rounded-lg p-3`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{material.name}</p>
                            <p className={`text-xs ${hasInsufficientStock ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                              {material.category} • Stock: {material.stock}
                              {hasInsufficientStock && ' ⚠️'}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAddOn(materialId)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateAddOnQuantity(materialId, currentQty - 1)}
                            disabled={currentQty <= 1}
                            className="h-8 w-8 p-0 border-2 border-gray-300 flex-shrink-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={material.stock}
                            value={currentQty}
                            onChange={(e) => handleUpdateAddOnQuantity(materialId, parseInt(e.target.value) || 1)}
                            className="text-center text-sm font-bold h-8 w-16 border-2 border-secondary/30"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateAddOnQuantity(materialId, currentQty + 1)}
                            disabled={currentQty >= material.stock}
                            className="h-8 w-8 p-0 border-2 border-gray-300 flex-shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Badge className="bg-secondary text-primary font-bold ml-auto text-sm px-2 flex-shrink-0">
                            +{currentQty}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              )}

              {addedAddOns.length === 0 && (
                <div className="text-center py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                  <Package2 className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No add-on materials selected</p>
                  <p className="text-xs text-gray-400 mt-1">Select materials from the dropdown above</p>
                </div>
              )}
            </div>

            {/* Bill of Materials Summary */}
            {productToUse && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Package2 className="w-4 h-4 text-blue-600" />
                  Materials to be Deducted
                </p>
                <ul className="space-y-2">
                  {/* Base Materials from BOM */}
                  {productToUse.billOfMaterials.map((bom, bomIdx) => {
                    const material = rawMaterials.find(m => m.id === bom.materialId);
                    const totalDeduction = bom.quantity * productUseQuantity;
                    const hasInsufficientStock = material && material.stock < totalDeduction;
                    return (
                      <li key={`bom-${bomIdx}-${bom.materialId}`} className={`text-sm flex items-center justify-between gap-2 rounded-md px-3 py-2 ${
                        hasInsufficientStock ? 'bg-red-100/60 border-2 border-red-300' : 'bg-white/60'
                      }`}>
                        <span className="font-medium truncate flex-1 min-w-0">
                          • {material?.name || 'Unknown'}
                          {hasInsufficientStock && <span className="text-red-600 ml-1">⚠️</span>}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">({bom.quantity} × {productUseQuantity})</span>
                          <Badge variant="outline" className={hasInsufficientStock ? 'bg-red-200 border-red-400 text-red-800 font-bold' : 'bg-red-50 border-red-200 text-red-700 font-bold'}>-{totalDeduction}</Badge>
                        </div>
                      </li>
                    );
                  })}
                  
                  {/* Add-on Materials Separator */}
                  {addedAddOns.length > 0 && (
                    <li className="border-t-2 border-secondary/20 pt-2 mt-2">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Add-on Materials</p>
                    </li>
                  )}
                  
                  {/* Add-on Materials */}
                  {Object.entries(addOnQuantities).filter(([_, qty]) => qty > 0).map(([materialId, qty]) => {
                    const material = rawMaterials.find(m => m.id === materialId);
                    const hasInsufficientStock = material && material.stock < qty;
                    return material && (
                      <li key={`addon-${materialId}`} className={`text-sm font-medium flex items-center justify-between gap-2 rounded-md px-3 py-2 ${
                        hasInsufficientStock ? 'bg-red-100 border-2 border-red-300' : 'bg-secondary/10 border-l-4 border-secondary'
                      }`}>
                        <span className={`truncate flex-1 min-w-0 ${hasInsufficientStock ? 'text-red-700' : 'text-secondary'}`}>
                          • {material.name}
                          {hasInsufficientStock && <span className="ml-1">⚠️</span>}
                        </span>
                        <Badge className={`flex-shrink-0 ${hasInsufficientStock ? 'bg-red-600 text-white font-bold' : 'bg-secondary text-primary font-bold'}`}>-{qty}</Badge>
                      </li>
                    );
                  })}
                </ul>
                
                {/* Stock Warning */}
                {hasStockIssues() && (
                  <div className="mt-3 flex items-start gap-2 bg-red-50 border-2 border-red-300 rounded-md p-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-red-800">Insufficient Stock</p>
                      <p className="text-xs text-red-600 mt-1">
                        Some materials don't have enough stock. Please adjust quantities or restock materials.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 flex-shrink-0 flex-row justify-end">
            <Button variant="outline" onClick={handleCancelUse} className="border-gray-300 hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUse}
              disabled={hasStockIssues()}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-secondary font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Package2 className="w-4 h-4 mr-2" />
              Produce {productUseQuantity} {productUseQuantity > 1 ? 'Units' : 'Unit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Finished Product</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Update the details of this finished product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Product Image */}
            <div className="space-y-2">
              <Label htmlFor="edit-product-image">Product Image</Label>
              
              {!editProductImageUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-secondary/50 transition-colors">
                  <label htmlFor="edit-product-image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-16 h-16 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Click to upload product image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                  <input
                    id="edit-product-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative border-2 border-secondary/30 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <div className="flex items-center gap-4">
                    <img
                      src={editProductImageUrl}
                      alt="Product preview"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-secondary/20 shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Image uploaded</p>
                      <p className="text-xs text-gray-500 mt-1">Preview shown</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={removeEditImage} className="flex items-center gap-1">
                      <X className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-product-name">Product Name</Label>
              <Input
                id="edit-product-name"
                value={editProductName}
                onChange={(e) => setEditProductName(e.target.value)}
                placeholder="e.g., Engraved Photo Memory Necklace"
              />
            </div>

            {/* Main Category */}
            <div className="space-y-2">
              <Label htmlFor="edit-product-category">Main Category</Label>
              <select
                id="edit-product-category"
                value={editProductCategory}
                onChange={(e) => {
                  setEditProductCategory(e.target.value);
                  setEditProductSubCategory('');
                  // Clear gender if not Jewels Products
                  if (e.target.value !== 'Jewels Products') {
                    setEditProductGender('');
                  }
                }}
                className="w-full px-3 py-2 border rounded-md bg-white mt-1"
              >
                <option value="">Select main category</option>
                <option value="Jewels Products">Jewels Products</option>
                <option value="Apparel Products">Apparel Products</option>
                <option value="Decor Products">Decor Products</option>
              </select>
            </div>

            {/* Sub-Category */}
            {editProductCategory && (
              <div className="space-y-2">
                <Label htmlFor="edit-product-sub-category">Sub-Category</Label>
                <select
                  id="edit-product-sub-category"
                  value={editProductSubCategory}
                  onChange={(e) => setEditProductSubCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                >
                  <option value="">Select sub-category</option>
                  {CATEGORY_CONFIG[editProductCategory]?.map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Gender - Only for Jewels Products */}
            {editProductCategory === 'Jewels Products' && (
              <div className="space-y-2">
                <Label htmlFor="edit-product-gender">Gender</Label>
                <select
                  id="edit-product-gender"
                  value={editProductGender}
                  onChange={(e) => setEditProductGender(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                >
                  <option value="">Select gender</option>
                  <option value="MEN">MEN</option>
                  <option value="WOMEN">WOMEN</option>
                </select>
              </div>
            )}

            {/* Bill of Materials */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Bill of Materials</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEditMaterialToBOM}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Material
                </Button>
              </div>

              {editBillOfMaterials.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed rounded-lg">
                  No materials added yet. Click "Add Material" to start.
                </p>
              ) : (
                <div className="space-y-2">
                  {editBillOfMaterials.map((bom, index) => (
                    <div key={index} className="flex gap-2 items-end border p-3 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <Label className="text-xs">Material</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md bg-white mt-1"
                          value={bom.materialId}
                          onChange={(e) => updateEditBOMMaterial(index, e.target.value)}
                        >
                          {rawMaterials.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={bom.quantity}
                          onChange={(e) => updateEditBOMQuantity(index, parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeEditBOMMaterial(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSaveEditProduct} className="w-full">
              Save Product
            </Button>

            {/* Delete Product Button */}
            {onDeleteProduct && editingProduct && (
              <Button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  handleDeleteProduct(editingProduct);
                }}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Product
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Delete Finished Product</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to delete this finished product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {productToDelete && (
            <div className="space-y-4 py-4">
              {/* Product Image */}
              {productToDelete.imageUrl && (
                <div className="flex justify-center pb-2">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={productToDelete.imageUrl}
                      alt={productToDelete.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product Name</Label>
                    <p className="text-lg font-bold text-gray-900 mt-1 break-words">{productToDelete.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-red-200">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Stock</Label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {productToDelete.stock} pcs
                    </p>
                  </div>

                  {productToDelete.category && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1 truncate">
                        {productToDelete.category}
                      </p>
                    </div>
                  )}
                </div>

                {productToDelete.subCategory && (
                  <div className="pt-2 border-t border-red-200">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sub-Category</Label>
                    <p className="text-sm text-gray-700 mt-1">
                      {productToDelete.subCategory}
                    </p>
                  </div>
                )}

                {productToDelete.billOfMaterials && productToDelete.billOfMaterials.length > 0 && (
                  <div className="pt-2 border-t border-red-200">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bill of Materials</Label>
                    <div className="mt-1 text-sm text-gray-700">
                      {productToDelete.billOfMaterials.length} material{productToDelete.billOfMaterials.length !== 1 ? 's' : ''} configured
                    </div>
                  </div>
                )}
              </div>

              {/* Warning Message */}
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Warning</p>
                  <p className="text-xs text-red-700 mt-1">
                    This product will be permanently deleted from your inventory. All associated bill of materials data will be lost.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={cancelDeleteConfirm}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteProduct}
                  className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
