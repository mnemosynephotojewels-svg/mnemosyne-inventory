import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Check, X, Upload, Pencil, Search, PackagePlus, Filter, Trash2, ExternalLink, Link as LinkIcon, Minus, TrendingUp, AlertCircle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RawMaterial, FinishedProduct } from '../types/inventory';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

// Category Configuration
const MATERIAL_CATEGORIES = [
  'PENDANT & GLASS',
  'ACCESSORIES',
  'LAMP, MAGNET & CLOCK',
  'CHAIN',
  'ADD-ONS & BOXES',
  'MAILER BOX/PLUS BOX',
  'PAPERS & OTHER CRAFT TOOLS',
  'PACKAGING MATERIALS'
];

interface RawMaterialsTabProps {
  rawMaterials: RawMaterial[];
  finishedProducts?: FinishedProduct[];
  onAddMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  onUpdateMaterial: (id: string, stock: number) => void;
  onEditMaterial?: (id: string, material: Omit<RawMaterial, 'id'>) => void;
  onDeleteMaterial?: (id: string) => void;
  onDeductMaterial?: (id: string, quantity: number, description: string) => void;
  selectedMaterialId?: string | null;
  onClearSelection?: () => void;
}

export function RawMaterialsTab({
  rawMaterials,
  finishedProducts = [],
  onAddMaterial,
  onUpdateMaterial,
  onEditMaterial,
  onDeleteMaterial,
  onDeductMaterial,
  selectedMaterialId,
  onClearSelection,
}: RawMaterialsTabProps) {
  console.log('🔍 RawMaterialsTab rendered with materials:', rawMaterials.length);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [materialCategory, setMaterialCategory] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialReorderLink, setMaterialReorderLink] = useState('');
  const [initialStock, setInitialStock] = useState('0');
  const [unit, setUnit] = useState('pcs');
  const [materialImageUrl, setMaterialImageUrl] = useState('');
  const [monthlyThreshold, setMonthlyThreshold] = useState('0');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');
  
  // Filter State
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [stockLevelFilter, setStockLevelFilter] = useState<'all' | 'critical' | 'low' | 'safe'>('all');
  
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [editMaterialName, setEditMaterialName] = useState('');
  const [editMaterialCategory, setEditMaterialCategory] = useState('');
  const [editMaterialDescription, setEditMaterialDescription] = useState('');
  const [editMaterialReorderLink, setEditMaterialReorderLink] = useState('');
  const [editMaterialStock, setEditMaterialStock] = useState('0');
  const [editMaterialUnit, setEditMaterialUnit] = useState('pcs');
  const [editMaterialImageUrl, setEditMaterialImageUrl] = useState('');
  const [editMaterialMonthlyThreshold, setEditMaterialMonthlyThreshold] = useState('0');
  
  // Add stock dialog state
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [addStockMaterial, setAddStockMaterial] = useState<RawMaterial | null>(null);
  const [stockToAdd, setStockToAdd] = useState('');

  // Delete confirm dialog state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<RawMaterial | null>(null);

  // Deduct stock dialog state
  const [isDeductStockDialogOpen, setIsDeductStockDialogOpen] = useState(false);
  const [deductStockMaterial, setDeductStockMaterial] = useState<RawMaterial | null>(null);
  const [stockToDeduct, setStockToDeduct] = useState('');
  const [deductDescription, setDeductDescription] = useState('');

  // Refs for material cards to scroll to selected material
  const materialRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // State for highlighting selected material
  const [highlightedMaterialId, setHighlightedMaterialId] = useState<string | null>(null);

  // Calculate usage frequency for each material
  const getMaterialUsageCount = (materialId: string): number => {
    let count = 0;
    finishedProducts.forEach(product => {
      const bomItem = product.billOfMaterials.find(bom => bom.materialId === materialId);
      if (bomItem) {
        count += bomItem.quantity;
      }
    });
    return count;
  };

  // Get top used materials (top 3)
  const getTopUsedMaterials = (): Set<string> => {
    const usageCounts = rawMaterials.map(material => ({
      id: material.id,
      count: getMaterialUsageCount(material.id)
    })).filter(item => item.count > 0);
    
    usageCounts.sort((a, b) => b.count - a.count);
    return new Set(usageCounts.slice(0, 3).map(item => item.id));
  };

  const topUsedMaterials = getTopUsedMaterials();

  // Get stock health color and level based on monthly threshold
  const getStockHealth = (stock: number, monthlyThreshold: number = 0): { color: string; level: number; label: string } => {
    if (stock === 0) {
      return { color: 'bg-red-500', level: 0, label: 'Out of Stock' };
    } else if (monthlyThreshold > 0 && stock < monthlyThreshold) {
      return { color: 'bg-orange-500', level: (stock / monthlyThreshold) * 100, label: 'Low Stock' };
    } else {
      // Safe stock - use 100 as max for calculation if no threshold
      const maxStock = monthlyThreshold > 0 ? monthlyThreshold * 2 : 100;
      return { color: 'bg-green-500', level: Math.min((stock / maxStock) * 100, 100), label: 'Safe' };
    }
  };

  // Scroll to and highlight selected material from dashboard
  useEffect(() => {
    if (selectedMaterialId && materialRefs.current[selectedMaterialId]) {
      // Scroll to the material
      setTimeout(() => {
        materialRefs.current[selectedMaterialId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);

      // Highlight the material
      setHighlightedMaterialId(selectedMaterialId);

      // Show toast
      const material = rawMaterials.find(m => m.id === selectedMaterialId);
      if (material) {
        toast.success(`Showing ${material.name} with low stock`);
      }

      // Auto-remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedMaterialId(null);
        onClearSelection?.();
      }, 3000);
    }
  }, [selectedMaterialId, rawMaterials, onClearSelection]);

  // Filter products based on selected filters using monthly threshold
  const filteredMaterials = rawMaterials.filter(material => {
    // Category filter
    if (filterCategory !== 'all' && material.category !== filterCategory) {
      return false;
    }
    
    const threshold = material.monthlyThreshold || 20;
    
    // Stock level filter
    if (stockLevelFilter === 'critical' && material.stock !== 0) {
      return false;
    }
    if (stockLevelFilter === 'low' && (material.stock === 0 || material.stock >= threshold)) {
      return false;
    }
    if (stockLevelFilter === 'safe' && material.stock < threshold) {
      return false;
    }
    
    return true;
  });

  // Group materials by category when filters are 'all'
  const shouldGroupByCategory = filterCategory === 'all' && stockLevelFilter === 'all';
  
  // Group materials by category
  const groupedMaterials: { [key: string]: RawMaterial[] } = {};
  if (shouldGroupByCategory) {
    // Group by category
    MATERIAL_CATEGORIES.forEach(category => {
      const materialsInCategory = filteredMaterials.filter(m => m.category === category);
      if (materialsInCategory.length > 0) {
        groupedMaterials[category] = materialsInCategory;
      }
    });
    
    // Add uncategorized materials (materials with old categories or no category)
    const uncategorized = filteredMaterials.filter(m => !MATERIAL_CATEGORIES.includes(m.category || ''));
    if (uncategorized.length > 0) {
      groupedMaterials['Other Materials'] = uncategorized;
    }
    
    // If no materials in any group, show all materials as uncategorized
    if (Object.keys(groupedMaterials).length === 0 && filteredMaterials.length > 0) {
      groupedMaterials['All Materials'] = filteredMaterials;
    }
  } else {
    // Single group when filters are active
    if (filteredMaterials.length > 0) {
      groupedMaterials['Filtered Materials'] = filteredMaterials;
    }
  }

  // Count materials by stock level for filter badges using monthly threshold
  const stockLevelCounts = {
    critical: rawMaterials.filter(m => m.stock === 0).length,
    low: rawMaterials.filter(m => {
      const threshold = m.monthlyThreshold || 20;
      return m.stock > 0 && m.stock < threshold;
    }).length,
    safe: rawMaterials.filter(m => {
      const threshold = m.monthlyThreshold || 20;
      return m.stock >= threshold;
    }).length,
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setMaterialImageUrl(reader.result as string);
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditMaterialImageUrl(reader.result as string);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setMaterialImageUrl('');
  };

  const removeEditImage = () => {
    setEditMaterialImageUrl('');
  };

  const handleAddMaterial = () => {
    if (!materialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }

    if (!materialCategory.trim()) {
      toast.error('Please select a category');
      return;
    }

    onAddMaterial({
      name: materialName,
      category: materialCategory,
      stock: parseInt(initialStock) || 0,
      unit,
      imageUrl: materialImageUrl,
      reorderLink: materialReorderLink,
      description: materialDescription,
      monthlyThreshold: parseInt(monthlyThreshold) || 0,
    });

    toast.success(`Material "${materialName}" added successfully`);
    setMaterialName('');
    setMaterialCategory('');
    setMaterialReorderLink('');
    setInitialStock('0');
    setUnit('pcs');
    setMaterialImageUrl('');
    setMaterialDescription('');
    setMonthlyThreshold('0');
    setIsAddDialogOpen(false);
  };

  const handleEditMaterial = (material: RawMaterial) => {
    setEditingMaterial(material);
    setEditMaterialName(material.name);
    setEditMaterialCategory(material.category || '');
    setEditMaterialReorderLink(material.reorderLink || '');
    setEditMaterialStock(material.stock.toString());
    setEditMaterialUnit(material.unit);
    setEditMaterialImageUrl(material.imageUrl || '');
    setEditMaterialDescription(material.description || '');
    setEditMaterialMonthlyThreshold((material.monthlyThreshold || 0).toString());
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMaterial || !onEditMaterial) return;

    if (!editMaterialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }

    if (!editMaterialCategory.trim()) {
      toast.error('Please select a category');
      return;
    }

    onEditMaterial(editingMaterial.id, {
      name: editMaterialName,
      category: editMaterialCategory,
      stock: parseInt(editMaterialStock) || 0,
      unit: editMaterialUnit,
      imageUrl: editMaterialImageUrl,
      reorderLink: editMaterialReorderLink,
      description: editMaterialDescription,
      monthlyThreshold: parseInt(editMaterialMonthlyThreshold) || 0,
    });

    toast.success(`Material "${editMaterialName}" updated successfully`);
    setIsEditDialogOpen(false);
    setEditingMaterial(null);
  };

  const startEditing = (material: RawMaterial) => {
    setEditingId(material.id);
    setEditStock(material.stock.toString());
  };

  const saveEdit = (id: string) => {
    const newStock = parseInt(editStock);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Please enter a valid stock number');
      return;
    }

    onUpdateMaterial(id, newStock);
    setEditingId(null);
    toast.success('Stock updated successfully');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStock('');
  };

  const handleAddStock = (material: RawMaterial) => {
    setAddStockMaterial(material);
    setStockToAdd('');
    setIsAddStockDialogOpen(true);
  };

  const saveAddStock = () => {
    if (!addStockMaterial) return;

    const newStock = parseInt(stockToAdd);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Please enter a valid stock number');
      return;
    }

    console.log('📦 ADD STOCK - Starting...');
    console.log('   Material:', addStockMaterial.name);
    console.log('   Current stock:', addStockMaterial.stock);
    console.log('   Adding:', newStock);
    console.log('   New total will be:', addStockMaterial.stock + newStock);

    onUpdateMaterial(addStockMaterial.id, addStockMaterial.stock + newStock);
    setAddStockMaterial(null);
    setIsAddStockDialogOpen(false);
    toast.success('Stock added successfully');
  };

  const handleDeleteMaterial = (id: string) => {
    if (!onDeleteMaterial) return;

    onDeleteMaterial(id);
    toast.success('Material deleted successfully');
  };

  const openDeleteConfirm = (material: RawMaterial) => {
    setMaterialToDelete(material);
    setIsDeleteConfirmOpen(true);
  };

  const cancelDeleteConfirm = () => {
    setMaterialToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const confirmDelete = () => {
    if (!materialToDelete || !onDeleteMaterial) return;

    onDeleteMaterial(materialToDelete.id);
    toast.success('Material deleted successfully');
    setMaterialToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const handleDeductStock = (material: RawMaterial) => {
    setDeductStockMaterial(material);
    setStockToDeduct('');
    setDeductDescription('');
    setIsDeductStockDialogOpen(true);
  };

  const saveDeductStock = () => {
    if (!deductStockMaterial || !onDeductMaterial) return;

    const newStock = parseInt(stockToDeduct);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Please enter a valid stock number');
      return;
    }

    if (newStock > deductStockMaterial.stock) {
      toast.error('Deducted stock cannot be greater than current stock');
      return;
    }

    onDeductMaterial(deductStockMaterial.id, newStock, deductDescription);
    setDeductStockMaterial(null);
    setIsDeductStockDialogOpen(false);
    toast.success('Stock deducted successfully');
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-secondary/20">
      {/* Header inside white container */}
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-2 tracking-tight">
              Raw Materials
            </h2>
            <p className="text-gray-500 text-base">
              Manage your raw material inventory with elegance
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
                <Plus className="w-5 h-5" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">Add New Raw Material</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Add a new raw material to your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="material-name" className="text-sm font-semibold text-gray-700">Material Name</Label>
                  <Input
                    id="material-name"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="e.g., Chain, Pendant, Clasp"
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-category" className="text-sm font-semibold text-gray-700">Category</Label>
                  <select
                    id="material-category"
                    value={materialCategory}
                    onChange={(e) => setMaterialCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  >
                    <option value="">Select a category</option>
                    {MATERIAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-reorder-link" className="text-sm font-semibold text-gray-700">Reorder Link</Label>
                  <Input
                    id="material-reorder-link"
                    value={materialReorderLink}
                    onChange={(e) => setMaterialReorderLink(e.target.value)}
                    placeholder="e.g., https://example.com/reorder"
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-image">Material Image</Label>
                  
                  {!materialImageUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-secondary/50 transition-colors">
                      <label
                        htmlFor="material-image-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-16 h-16 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload material image
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </label>
                      <input
                        id="material-image-upload"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/heic,.heic,.png,.jpg,.jpeg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative border-2 border-secondary/30 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100/50">
                      <div className="flex items-center gap-4">
                        <img
                          src={materialImageUrl}
                          alt="Material preview"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-secondary/20 shadow-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Image uploaded</p>
                          <p className="text-xs text-gray-500 mt-1">Preview shown</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-semibold text-gray-700">Unit</Label>
                  <select
                    id="unit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="m">Meters (m)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="l">Liters (l)</option>
                    <option value="ml">Milliliters (ml)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial-stock-raw" className="text-sm font-semibold text-gray-700">Initial Stock</Label>
                  <Input
                    id="initial-stock-raw"
                    type="number"
                    min="0"
                    value={initialStock}
                    onChange={(e) => setInitialStock(e.target.value)}
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly-threshold" className="text-sm font-semibold text-gray-700">Monthly Threshold</Label>
                  <Input
                    id="monthly-threshold"
                    type="number"
                    min="0"
                    value={monthlyThreshold}
                    onChange={(e) => setMonthlyThreshold(e.target.value)}
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                    placeholder="e.g., 50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Stock below this value will be marked as <span className="text-orange-600 font-semibold">low stock</span>. Set to 0 to use default (20).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-description" className="text-sm font-semibold text-gray-700">Description</Label>
                  <Textarea
                    id="material-description"
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    placeholder="Enter a description for the material"
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  />
                </div>

                <Button 
                  onClick={handleAddMaterial} 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                >
                  Add Material
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Edit Material Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Edit Raw Material</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Update the details of this raw material.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-material-name" className="text-sm font-semibold text-gray-700">Material Name</Label>
                <Input
                  id="edit-material-name"
                  value={editMaterialName}
                  onChange={(e) => setEditMaterialName(e.target.value)}
                  placeholder="e.g., Chain, Pendant, Clasp"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-material-category" className="text-sm font-semibold text-gray-700">Category</Label>
                <select
                  id="edit-material-category"
                  value={editMaterialCategory}
                  onChange={(e) => setEditMaterialCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {MATERIAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-material-reorder-link" className="text-sm font-semibold text-gray-700">Reorder Link</Label>
                <Input
                  id="edit-material-reorder-link"
                  value={editMaterialReorderLink}
                  onChange={(e) => setEditMaterialReorderLink(e.target.value)}
                  placeholder="e.g., https://example.com/reorder"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-material-image">Material Image</Label>
                
                {!editMaterialImageUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-secondary/50 transition-colors">
                    <label
                      htmlFor="edit-material-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload material image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </label>
                    <input
                      id="edit-material-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/heic,.heic,.png,.jpg,.jpeg"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative border-2 border-secondary/30 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100/50">
                    <div className="flex items-center gap-4">
                      <img
                        src={editMaterialImageUrl}
                        alt="Material preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-secondary/20 shadow-md"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Image uploaded</p>
                        <p className="text-xs text-gray-500 mt-1">Preview shown</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeEditImage}
                        className="flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-unit" className="text-sm font-semibold text-gray-700">Unit</Label>
                <select
                  id="edit-unit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  value={editMaterialUnit}
                  onChange={(e) => setEditMaterialUnit(e.target.value)}
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="m">Meters (m)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="l">Liters (l)</option>
                  <option value="ml">Milliliters (ml)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-material-stock" className="text-sm font-semibold text-gray-700">Stock</Label>
                <Input
                  id="edit-material-stock"
                  type="number"
                  min="0"
                  value={editMaterialStock}
                  onChange={(e) => setEditMaterialStock(e.target.value)}
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-material-description" className="text-sm font-semibold text-gray-700">Description</Label>
                <Textarea
                  id="edit-material-description"
                  value={editMaterialDescription}
                  onChange={(e) => setEditMaterialDescription(e.target.value)}
                  placeholder="Enter a description for the material"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-monthly-threshold" className="text-sm font-semibold text-gray-700">Monthly Threshold</Label>
                <Input
                  id="edit-monthly-threshold"
                  type="number"
                  min="0"
                  value={editMaterialMonthlyThreshold}
                  onChange={(e) => setEditMaterialMonthlyThreshold(e.target.value)}
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  placeholder="e.g., 50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Stock below this value will be marked as <span className="text-orange-600 font-semibold">low stock</span>. Set to 0 to use default (20).
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveEdit} 
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                >
                  Save Changes
                </Button>
                
                {onDeleteMaterial && editingMaterial && (
                  <Button 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      openDeleteConfirm(editingMaterial);
                    }}
                    className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md px-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Stock Dialog */}
        <Dialog open={isAddStockDialogOpen} onOpenChange={setIsAddStockDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Add Stock</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Increase the stock for this raw material.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Material Name</Label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {addStockMaterial?.name || ''}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Current Stock</Label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {addStockMaterial?.stock || 0} {addStockMaterial?.unit || 'pcs'}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock-to-add" className="text-sm font-semibold text-gray-700">
                  Quantity to Add ({addStockMaterial?.unit || 'pcs'})
                </Label>
                <Input
                  id="stock-to-add"
                  type="number"
                  min="0"
                  value={stockToAdd}
                  onChange={(e) => setStockToAdd(e.target.value)}
                  placeholder="Enter quantity to add"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  autoFocus
                />
              </div>

              {stockToAdd && parseInt(stockToAdd) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">New Total Stock:</span>
                    <Badge className="px-3 py-1 text-base font-bold bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600/30">
                      {(addStockMaterial?.stock || 0) + parseInt(stockToAdd)} {addStockMaterial?.unit || 'pcs'}
                    </Badge>
                  </div>
                </motion.div>
              )}

              <Button 
                onClick={saveAddStock} 
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
              >
                Confirm Add Stock
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Delete Raw Material</DialogTitle>
              <DialogDescription>
                Confirm deletion of {materialToDelete?.name}. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {materialToDelete && (
              <>
                {/* Header with Gradient */}
                <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Delete Material</h2>
                      <p className="text-red-100 text-sm">Permanent action</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Material Card */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      {materialToDelete.imageUrl ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                          <img
                            src={materialToDelete.imageUrl}
                            alt={materialToDelete.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 break-words">
                          {materialToDelete.name}
                        </h3>
                        
                        <div className="space-y-2">
                          {/* Stock Badge */}
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-2 py-1">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {materialToDelete.stock} {materialToDelete.unit}
                            </Badge>
                          </div>

                          {/* Category */}
                          {materialToDelete.category && (
                            <p className="text-sm text-gray-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                              {materialToDelete.category}
                            </p>
                          )}

                          {/* Reorder Link */}
                          {materialToDelete.reorderLink && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate">Has reorder link</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          This action cannot be undone
                        </p>
                        <p className="text-xs text-red-700 leading-relaxed">
                          The material will be permanently removed. Any finished products using this material may be affected.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={cancelDeleteConfirm}
                      variant="outline"
                      className="flex-1 h-11 font-medium border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      className="flex-1 h-11 font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Deduct Stock Dialog */}
        <Dialog open={isDeductStockDialogOpen} onOpenChange={setIsDeductStockDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Deduct Stock</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Decrease the stock for this raw material.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Material Name</Label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {deductStockMaterial?.name || ''}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Current Stock</Label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {deductStockMaterial?.stock || 0} {deductStockMaterial?.unit || 'pcs'}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock-to-deduct" className="text-sm font-semibold text-gray-700">
                  Quantity to Deduct ({deductStockMaterial?.unit || 'pcs'})
                </Label>
                <Input
                  id="stock-to-deduct"
                  type="number"
                  min="0"
                  value={stockToDeduct}
                  onChange={(e) => setStockToDeduct(e.target.value)}
                  placeholder="Enter quantity to deduct"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deduct-description" className="text-sm font-semibold text-gray-700">
                  Description (optional)
                </Label>
                <Textarea
                  id="deduct-description"
                  value={deductDescription}
                  onChange={(e) => setDeductDescription(e.target.value)}
                  placeholder="Enter a description for the deduction"
                  className="border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              {stockToDeduct && parseInt(stockToDeduct) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">New Total Stock:</span>
                    <Badge className="px-3 py-1 text-base font-bold bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600/30">
                      {(deductStockMaterial?.stock || 0) - parseInt(stockToDeduct)} {deductStockMaterial?.unit || 'pcs'}
                    </Badge>
                  </div>
                </motion.div>
              )}

              <Button 
                onClick={saveDeductStock} 
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
              >
                Confirm Deduct Stock
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters Section */}
        <div className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-category" className="text-sm font-semibold text-gray-700">
                Category
              </Label>
              <select
                id="filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg bg-white hover:border-primary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none font-medium"
              >
                <option value="all">All Categories</option>
                {MATERIAL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Stock Level Filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-stock-level" className="text-sm font-semibold text-gray-700">
                Stock Level
              </Label>
              <select
                id="filter-stock-level"
                value={stockLevelFilter}
                onChange={(e) => setStockLevelFilter(e.target.value as 'all' | 'critical' | 'low' | 'safe')}
                className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-lg bg-white hover:border-primary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none font-medium"
              >
                <option value="all">All Levels ({rawMaterials.length})</option>
                <option value="critical">Out of Stock (0) ({stockLevelCounts.critical})</option>
                <option value="low">Low Stock (Below Threshold) ({stockLevelCounts.low})</option>
                <option value="safe">Safe Stock (Above Threshold) ({stockLevelCounts.safe})</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {filterCategory !== 'all' && (
              <Badge className="bg-primary text-secondary">
                {filterCategory}
                <button
                  onClick={() => setFilterCategory('all')}
                  className="ml-2 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {stockLevelFilter !== 'all' && (
              <Badge className="bg-blue-500 text-white">
                Stock: {stockLevelFilter}
                <button
                  onClick={() => setStockLevelFilter('all')}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {(filterCategory === 'all' && stockLevelFilter === 'all') && (
              <span className="text-sm text-gray-500 italic">No filters applied</span>
            )}
          </div>
        </div>

        {/* Materials Display - Grouped or Flat */}
        {Object.keys(groupedMaterials).map((categoryName, groupIndex) => (
          <div key={categoryName} className="mb-8">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
              className="mb-4"
            >
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                {categoryName}
                <Badge className="bg-secondary text-primary">
                  {groupedMaterials[categoryName].length}
                </Badge>
              </h3>
            </motion.div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupedMaterials[categoryName].map((material, index) => {
                const stockHealth = getStockHealth(material.stock, material.monthlyThreshold);
                const isTopUsed = topUsedMaterials.has(material.id);
                const threshold = material.monthlyThreshold || 20;
                const isCritical = material.stock === 0;
                const isLowStock = material.stock > 0 && material.stock < threshold;
                
                return (
                  <motion.div
                    key={material.id}
                    ref={(el) => {
                      materialRefs.current[material.id] = el;
                    }}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Card 
                      className={`overflow-hidden transition-all duration-300 border-2 bg-white/95 backdrop-blur-sm relative flex flex-col ${
                        highlightedMaterialId === material.id
                          ? 'border-4 border-secondary shadow-2xl ring-4 ring-secondary/30 animate-pulse bg-gradient-to-br from-secondary/10 to-primary/5'
                          : 'border-secondary/10 hover:border-secondary/30 hover:shadow-2xl'
                      }`}
                    >
                      {/* Top Used Badge - Top Left Corner */}
                      {isTopUsed && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute top-2 left-2 z-10"
                        >
                          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 shadow-lg flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Top Used
                          </Badge>
                        </motion.div>
                      )}

                      {/* Edit Button - Top Right */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMaterial(material)}
                        className={`absolute top-2 right-2 z-10 w-7 h-7 p-0 rounded-full bg-white/80 hover:bg-secondary/20 border border-secondary/20 shadow-md hover:shadow-lg transition-all ${isTopUsed ? 'top-9' : ''}`}
                      >
                        <Pencil className="w-3.5 h-3.5 text-primary" />
                      </Button>
                      
                      <CardHeader className="pb-1.5 bg-gradient-to-br from-primary/5 to-transparent pt-2.5 px-4">
                        <div className="flex items-start gap-2 pr-6">
                          {material.imageUrl && (
                            <div className="flex-shrink-0">
                              <ImageWithFallback
                                src={material.imageUrl}
                                alt={material.name}
                                className="w-16 h-16 rounded-lg object-cover border-2 border-secondary/30 shadow-md"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base text-primary mb-1 line-clamp-1">{material.name}</CardTitle>
                            {material.category && (
                              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary/70 px-1.5 py-0">
                                {material.category}
                              </Badge>
                            )}
                            {material.description && (
                              <p className="text-[10px] text-gray-600 mt-1 line-clamp-1">
                                {material.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-2 px-4 pb-2">
                        <div className="flex flex-col">
                          {/* Stock Level Display */}
                          <div className="space-y-1.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-medium text-gray-600">Stock Level:</span>
                              <Badge
                                className={`px-2 py-1 text-sm font-bold shadow-md ${
                                  material.stock === 0
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                                    : isLowStock
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                }`}
                              >
                                {material.stock} {material.unit}
                              </Badge>
                            </div>
                            {/* Monthly Threshold Display */}
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-medium text-gray-500">Monthly Threshold:</span>
                              <span className="text-xs font-semibold text-gray-600">
                                {threshold} {material.unit}
                              </span>
                            </div>
                          </div>
                          
                          {/* Buttons Group */}
                          <div className="mt-2 space-y-0">
                            {/* Smart Reorder Button - Glows when Critical or Low */}
                            {material.reorderLink && (
                              <motion.a
                                href={material.reorderLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                animate={(isCritical || isLowStock) ? {
                                  boxShadow: [
                                    '0 0 0 0 rgba(239, 68, 68, 0)',
                                    '0 0 0 10px rgba(239, 68, 68, 0)',
                                    '0 0 0 0 rgba(239, 68, 68, 0)',
                                  ],
                                } : {}}
                                transition={(isCritical || isLowStock) ? {
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: 'loop',
                                } : {}}
                                className={`cursor-pointer flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all mb-1.5 ${
                                  isCritical
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse'
                                    : isLowStock
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                }`}
                              >
                                <ExternalLink className="w-3 h-3" />
                                {isCritical ? 'URGENT: Out of Stock!' : isLowStock ? 'Reorder Soon' : 'Reorder Link'}
                              </motion.a>
                            )}
                          
                            {/* Action Buttons - Directly Below Reorder Link */}
                            <div className="grid grid-cols-2 gap-2">
                            {onDeductMaterial && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeductStock(material)}
                                className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 text-xs font-semibold shadow-md hover:shadow-lg transition-all border-0 rounded-lg"
                              >
                                <Minus className="w-3.5 h-3.5" />
                                Deduct
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddStock(material)}
                              className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-secondary py-2 text-xs font-semibold shadow-md hover:shadow-lg transition-all border-0 rounded-lg"
                            >
                              <PackagePlus className="w-3.5 h-3.5" />
                              Add Stock
                            </Button>
                          </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredMaterials.length === 0 && (
          <Card className="border-2 border-dashed border-secondary/30">
            <CardContent className="py-16 text-center">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-primary opacity-60" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No materials found
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your filters or add new materials
              </p>
            </CardContent>
          </Card>
        )}
    </Card>
  );
}