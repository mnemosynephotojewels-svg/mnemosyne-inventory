import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Check, X, Upload, Pencil, Search, PackagePlus, Trash2, ExternalLink, Minus, ShoppingCart, AlertTriangle, TrendingDown, Clock, AlertCircle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { PackagingMaterial } from '../types/inventory';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

interface PackagingMaterialsTabProps {
  packagingMaterials: PackagingMaterial[];
  onAddMaterial: (material: Omit<PackagingMaterial, 'id'>) => void;
  onUpdateMaterial: (id: string, stock: number) => void;
  onEditMaterial?: (id: string, material: Omit<PackagingMaterial, 'id'>) => void;
  onDeleteMaterial?: (id: string) => void;
  onDeductMaterial?: (id: string, quantity: number, description: string) => void;
  selectedMaterialId?: string | null;
  onClearSelection?: () => void;
}

export function PackagingMaterialsTab({
  packagingMaterials,
  onAddMaterial,
  onUpdateMaterial,
  onEditMaterial,
  onDeleteMaterial,
  onDeductMaterial,
  selectedMaterialId,
  onClearSelection,
}: PackagingMaterialsTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [materialReorderLink, setMaterialReorderLink] = useState('');
  const [initialStock, setInitialStock] = useState('0');
  const [unit, setUnit] = useState('pcs');
  const [materialImageUrl, setMaterialImageUrl] = useState('');
  const [monthlyThreshold, setMonthlyThreshold] = useState('20');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<PackagingMaterial | null>(null);
  const [editMaterialName, setEditMaterialName] = useState('');
  const [editMaterialReorderLink, setEditMaterialReorderLink] = useState('');
  const [editMaterialStock, setEditMaterialStock] = useState('0');
  const [editMaterialUnit, setEditMaterialUnit] = useState('pcs');
  const [editMaterialImageUrl, setEditMaterialImageUrl] = useState('');
  const [editMonthlyThreshold, setEditMonthlyThreshold] = useState('20');
  
  // Add stock dialog state
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [addStockMaterial, setAddStockMaterial] = useState<PackagingMaterial | null>(null);
  const [stockToAdd, setStockToAdd] = useState('');

  // Deduct stock dialog state
  const [isDeductStockDialogOpen, setIsDeductStockDialogOpen] = useState(false);
  const [deductStockMaterial, setDeductStockMaterial] = useState<PackagingMaterial | null>(null);
  const [stockToDeduct, setStockToDeduct] = useState('');
  const [deductDescription, setDeductDescription] = useState('');

  // Delete confirm dialog state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<PackagingMaterial | null>(null);

  // Highlight/scroll state for dashboard navigation
  const [highlightedMaterialId, setHighlightedMaterialId] = useState<string | null>(null);
  const materialRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to and highlight selected material from dashboard
  useEffect(() => {
    if (selectedMaterialId && materialRefs.current[selectedMaterialId]) {
      setTimeout(() => {
        materialRefs.current[selectedMaterialId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);

      setHighlightedMaterialId(selectedMaterialId);

      const material = packagingMaterials.find(m => m.id === selectedMaterialId);
      if (material) {
        toast.success(`Showing ${material.name} with low stock`);
      }

      setTimeout(() => {
        setHighlightedMaterialId(null);
        onClearSelection?.();
      }, 3000);
    }
  }, [selectedMaterialId, packagingMaterials, onClearSelection]);

  const handleAddMaterial = () => {
    if (!materialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }

    const stock = parseFloat(initialStock);
    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock amount');
      return;
    }

    console.log('📦 PackagingTab: Submitting new material:', {
      name: materialName,
      stock,
      unit,
      reorderLink: materialReorderLink || undefined,
      imageUrl: materialImageUrl || undefined,
      monthlyThreshold: parseInt(monthlyThreshold, 10),
    });

    onAddMaterial({
      name: materialName,
      stock,
      unit,
      reorderLink: materialReorderLink || undefined,
      imageUrl: materialImageUrl || undefined,
      monthlyThreshold: parseInt(monthlyThreshold, 10),
    });

    // Reset form
    setMaterialName('');
    setMaterialReorderLink('');
    setInitialStock('0');
    setUnit('pcs');
    setMaterialImageUrl('');
    setMonthlyThreshold('20');
    setIsAddDialogOpen(false);
    
    console.log('✅ PackagingTab: Material submitted, form reset');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditMaterialImageUrl(reader.result as string);
        } else {
          setMaterialImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStock = (id: string) => {
    const stock = parseFloat(editStock);
    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock amount');
      return;
    }

    onUpdateMaterial(id, stock);
    setEditingId(null);
    setEditStock('');
    toast.success('Stock updated successfully');
  };

  const handleEditClick = (material: PackagingMaterial) => {
    setEditingMaterial(material);
    setEditMaterialName(material.name);
    setEditMaterialReorderLink(material.reorderLink || '');
    setEditMaterialStock(material.stock.toString());
    setEditMaterialUnit(material.unit);
    setEditMaterialImageUrl(material.imageUrl || '');
    setEditMonthlyThreshold(material.monthlyThreshold?.toString() || '20');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMaterial || !onEditMaterial) return;

    if (!editMaterialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }

    const stock = parseFloat(editMaterialStock);
    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock amount');
      return;
    }

    onEditMaterial(editingMaterial.id, {
      name: editMaterialName,
      stock,
      unit: editMaterialUnit,
      reorderLink: editMaterialReorderLink || undefined,
      imageUrl: editMaterialImageUrl || undefined,
      monthlyThreshold: parseInt(editMonthlyThreshold, 10),
    });

    setIsEditDialogOpen(false);
    toast.success('Material updated successfully');
  };

  const handleAddStock = (material: PackagingMaterial) => {
    setAddStockMaterial(material);
    setStockToAdd('');
    setIsAddStockDialogOpen(true);
  };

  const handleConfirmAddStock = () => {
    if (!addStockMaterial) return;

    const amount = parseFloat(stockToAdd);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    console.log('📦 ADD STOCK (PACKAGING) - Starting...');
    console.log('   Material:', addStockMaterial.name);
    console.log('   Current stock:', addStockMaterial.stock);
    console.log('   Adding:', amount);
    console.log('   New total will be:', addStockMaterial.stock + amount);

    const newStock = addStockMaterial.stock + amount;
    onUpdateMaterial(addStockMaterial.id, newStock);
    setIsAddStockDialogOpen(false);
    setStockToAdd('');
    toast.success(`Added ${amount} ${addStockMaterial.unit} to ${addStockMaterial.name}`);
  };

  const handleDeductStock = (material: PackagingMaterial) => {
    setDeductStockMaterial(material);
    setStockToDeduct('');
    setDeductDescription('');
    setIsDeductStockDialogOpen(true);
  };

  const handleConfirmDeductStock = () => {
    if (!deductStockMaterial || !onDeductMaterial) return;

    const amount = parseFloat(stockToDeduct);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > deductStockMaterial.stock) {
      toast.error('Insufficient stock');
      return;
    }

    const newStock = deductStockMaterial.stock - amount;
    onUpdateMaterial(deductStockMaterial.id, newStock);
    onDeductMaterial(deductStockMaterial.id, amount, deductDescription);
    setIsDeductStockDialogOpen(false);
    setStockToDeduct('');
    setDeductDescription('');
    toast.success(`Deducted ${amount} ${deductStockMaterial.unit} from ${deductStockMaterial.name}`);
  };

  const openDeleteConfirm = (material: PackagingMaterial) => {
    setMaterialToDelete(material);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!materialToDelete || !onDeleteMaterial) return;
    
    onDeleteMaterial(materialToDelete.id);
    setIsDeleteConfirmOpen(false);
    setMaterialToDelete(null);
    toast.success(`${materialToDelete.name} deleted successfully`);
  };

  // Filter materials based on search
  const filteredMaterials = packagingMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper: Calculate stock health and color
  const getStockHealth = (stock: number) => {
    if (stock > 40) return { color: '#10b981', label: 'Stocked', percentage: Math.min((stock / 100) * 100, 100) };
    if (stock >= 11) return { color: '#f59e0b', label: 'Low', percentage: (stock / 40) * 100 };
    return { color: '#ef4444', label: 'Critical', percentage: (stock / 40) * 100 };
  };

  // Helper: Check if material is critical (essential for fulfillment)
  const isCriticalMaterial = (name: string): boolean => {
    const criticalItems = ['thermal paper', 'bubble wrap', 'tape', 'masking tape', 'stretch film'];
    return criticalItems.some(item => name.toLowerCase().includes(item));
  };

  // Helper: Calculate estimated orders remaining (assuming 1 unit per order)
  const getEstimatedOrders = (stock: number, name: string): number => {
    // Different consumption rates for different materials
    if (name.toLowerCase().includes('tape')) return Math.floor(stock / 0.5); // 0.5 tape per order
    if (name.toLowerCase().includes('bubble wrap')) return Math.floor(stock / 2); // 2 units per order
    if (name.toLowerCase().includes('box')) return stock; // 1 box per order
    return Math.floor(stock / 1); // Default 1 unit per order
  };

  // Get current timestamp for "Last Inventory Sync"
  const lastSyncTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-secondary/20">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-2 tracking-tight">
              Packaging Materials
            </h2>
            <p className="text-gray-500 text-base">
              Manage packaging and reorder supplies
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
                <Plus className="w-5 h-5" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border-2 border-secondary/20 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Plus className="w-6 h-6 text-secondary" />
                  Add New Packaging Material
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Add a new packaging material to your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="material-name" className="text-sm font-semibold text-gray-700">Material Name</Label>
                  <Input
                    id="material-name"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="e.g., Box, Bubble Wrap, Tape"
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-reorder-link" className="text-sm font-semibold text-gray-700">Reorder Link (Optional)</Label>
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
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-secondary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      </label>
                      <input
                        id="material-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative group">
                      <ImageWithFallback
                        src={materialImageUrl}
                        alt="Material preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-secondary/20"
                      />
                      <Button
                        type="button"
                        onClick={() => setMaterialImageUrl('')}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
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
                    <option value="box">Box</option>
                    <option value="roll">Roll</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial-stock" className="text-sm font-semibold text-gray-700">Initial Stock</Label>
                  <Input
                    id="initial-stock"
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
                    placeholder="e.g., 20"
                    className="border-gray-300 focus:border-secondary focus:ring-secondary"
                  />
                  <p className="text-xs text-gray-500">
                    Stock levels below this threshold will trigger alerts
                  </p>
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

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/60 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search packaging materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/95 border-2 border-secondary/30 focus:border-secondary text-primary placeholder:text-primary/50 py-6 text-base shadow-lg"
            />
          </div>
        </motion.div>

        {/* Materials Grid - INSIDE the white container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredMaterials.map((material, index) => {
            const threshold = material.monthlyThreshold || 20;
            const isCritical = material.stock === 0;
            const isLowStock = material.stock > 0 && material.stock < threshold;

            const isHighlighted = highlightedMaterialId === material.id;

            return (
              <motion.div
                key={material.id}
                ref={(el) => { materialRefs.current[material.id] = el; }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`bg-gray-50 rounded-2xl p-5 border-2 hover:shadow-xl transition-all duration-300 relative ${
                    isHighlighted
                      ? 'border-secondary shadow-[0_0_0_4px_rgba(212,175,55,0.35)] bg-secondary/5 animate-pulse'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Edit Button - Top Right */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(material)}
                    className="absolute top-4 right-4 z-10 w-7 h-7 p-0 hover:bg-gray-200/80 transition-all"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </Button>

                  {/* Material Header */}
                  <div className="flex items-center gap-4 mb-4 pt-2">
                    {material.imageUrl && (
                      <div className="flex-shrink-0">
                        <ImageWithFallback
                          src={material.imageUrl}
                          alt={material.name}
                          className="w-20 h-20 rounded-lg object-cover shadow-md"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-800 mb-1 truncate">{material.name}</h3>
                    </div>
                  </div>
                  
                  {/* Stock Level Display */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-gray-600">Stock Level:</span>
                      <Badge
                        variant={material.stock > (material.monthlyThreshold || 20) ? 'default' : 'destructive'}
                        className={`text-xs font-semibold ${
                          material.stock === 0 
                            ? 'bg-red-500 text-white' 
                            : material.stock < (material.monthlyThreshold || 20)
                            ? 'bg-orange-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {material.stock} {material.unit}
                      </Badge>
                    </div>
                    {/* Monthly Threshold Display */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-gray-500">Monthly Threshold:</span>
                      <span className="text-xs font-semibold text-gray-600">
                        {material.monthlyThreshold || 20} {material.unit}
                      </span>
                    </div>
                  </div>
                  
                  {/* Reorder Link */}
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
                      className={`cursor-pointer flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all mb-3 ${
                        isCritical
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse'
                          : isLowStock
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isCritical ? 'URGENT: Out of Stock!' : isLowStock ? 'Reorder Soon' : 'Reorder Link'}
                    </motion.a>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeductStock(material)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-5 text-sm font-semibold shadow-md hover:shadow-lg transition-all border-0"
                    >
                      <Minus className="w-4 h-4" />
                      Deduct
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddStock(material)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-secondary py-5 text-sm font-semibold shadow-md hover:shadow-lg transition-all border-0"
                    >
                      <PackagePlus className="w-4 h-4" />
                      Add Stock
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-block p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full mb-4">
              <PackagePlus className="w-16 h-16 text-primary/30" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {searchQuery ? 'No materials found matching your search' : 'No packaging materials yet'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try a different search term' : 'Click "Add Material" to get started'}
            </p>
          </motion.div>
        )}
      </Card>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-secondary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Edit2 className="w-6 h-6 text-secondary" />
              Edit Packaging Material
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Update material information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-material-name" className="text-sm font-semibold text-gray-700">Material Name</Label>
              <Input
                id="edit-material-name"
                value={editMaterialName}
                onChange={(e) => setEditMaterialName(e.target.value)}
                placeholder="e.g., Box, Bubble Wrap, Tape"
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
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
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                  <input
                    id="edit-material-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <ImageWithFallback
                    src={editMaterialImageUrl}
                    alt="Material preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-secondary/20"
                  />
                  <Button
                    type="button"
                    onClick={() => setEditMaterialImageUrl('')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
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
                <option value="box">Box</option>
                <option value="roll">Roll</option>
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
              <Label htmlFor="edit-monthly-threshold" className="text-sm font-semibold text-gray-700">Monthly Threshold</Label>
              <Input
                id="edit-monthly-threshold"
                type="number"
                min="0"
                value={editMonthlyThreshold}
                onChange={(e) => setEditMonthlyThreshold(e.target.value)}
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
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
        <DialogContent className="max-w-md bg-white border-2 border-secondary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <PackagePlus className="w-6 h-6 text-secondary" />
              Add Stock
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Add stock to {addStockMaterial?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stock-to-add" className="text-sm font-semibold text-gray-700">
                Amount to Add ({addStockMaterial?.unit})
              </Label>
              <Input
                id="stock-to-add"
                type="number"
                min="0"
                step="0.01"
                value={stockToAdd}
                onChange={(e) => setStockToAdd(e.target.value)}
                placeholder="Enter amount"
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsAddStockDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAddStock}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deduct Stock Dialog */}
      <Dialog open={isDeductStockDialogOpen} onOpenChange={setIsDeductStockDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-secondary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Minus className="w-6 h-6 text-orange-500" />
              Deduct Stock
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Deduct stock from {deductStockMaterial?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Current stock: <span className="font-bold">{deductStockMaterial?.stock} {deductStockMaterial?.unit}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-to-deduct" className="text-sm font-semibold text-gray-700">
                Amount to Deduct ({deductStockMaterial?.unit})
              </Label>
              <Input
                id="stock-to-deduct"
                type="number"
                min="0"
                step="0.01"
                value={stockToDeduct}
                onChange={(e) => setStockToDeduct(e.target.value)}
                placeholder="Enter amount"
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deduct-description" className="text-sm font-semibold text-gray-700">
                Deduction Description
              </Label>
              <Input
                id="deduct-description"
                value={deductDescription}
                onChange={(e) => setDeductDescription(e.target.value)}
                placeholder="e.g., Used for shipment"
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsDeductStockDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeductStock}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Delete Packaging Material</DialogTitle>
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
                            <Package className="w-3 h-3 mr-1" />
                            {materialToDelete.stock} {materialToDelete.unit}
                          </Badge>
                        </div>

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
                        The material will be permanently removed from your inventory.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    variant="outline"
                    className="flex-1 h-11 font-medium border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
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
    </>
  );
}