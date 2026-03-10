import { useState, useMemo } from 'react';
import { Plus, Minus, Download, Activity, CalendarIcon, FileText, FileSpreadsheet, Filter, X, Calendar, PackageOpen, Package } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { ActivityLog } from '../types/inventory';
import { toast } from 'sonner';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'motion/react';

interface ActivityLogTabProps {
  activityLog: ActivityLog[];
}

export function ActivityLogTab({ activityLog }: ActivityLogTabProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'recent' | 'stock'>('recent');
  
  // Export dialog state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState<Date | undefined>(undefined);
  const [exportEndDate, setExportEndDate] = useState<Date | undefined>(undefined);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');

  // Activity detail dialog state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);

  const handleActivityClick = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setIsDetailDialogOpen(true);
  };

  const filteredLog = activityLog.filter((log) => {
    if (!startDate && !endDate) return true;

    const logDate = new Date(log.timestamp);
    logDate.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return logDate >= start && logDate <= end;
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      return logDate >= start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return logDate <= end;
    }

    return true;
  });

  // Split activities: Material stock additions on right, everything else on left
  const { generalActivities, materialStockAdditions } = useMemo(() => {
    const general: ActivityLog[] = [];
    const stockAdditions: ActivityLog[] = [];

    filteredLog.forEach((log) => {
      if (log.action === 'MATERIAL_ADDED' && log.quantity > 0) {
        stockAdditions.push(log);
      } else if (log.action === 'PACKAGING_ADDED') {
        // Skip packaging additions in recent activity - don't show them
        return;
      } else {
        general.push(log);
      }
    });

    return { generalActivities: general, materialStockAdditions: stockAdditions };
  }, [filteredLog]);

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    toast.success('Filters cleared');
  };

  const exportToExcel = () => {
    // Filter logs based on export date range
    const logsToExport = activityLog.filter((log) => {
      if (!exportStartDate && !exportEndDate) return true;

      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);

      if (exportStartDate && exportEndDate) {
        const start = new Date(exportStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(exportEndDate);
        end.setHours(23, 59, 59, 999);
        return logDate >= start && logDate <= end;
      }

      if (exportStartDate) {
        const start = new Date(exportStartDate);
        start.setHours(0, 0, 0, 0);
        return logDate >= start;
      }

      if (exportEndDate) {
        const end = new Date(exportEndDate);
        end.setHours(23, 59, 59, 999);
        return logDate <= end;
      }

      return true;
    });

    if (logsToExport.length === 0) {
      toast.error('No data to export for selected date range');
      return;
    }

    try {
      const exportData = logsToExport.map((log) => {
        const baseData: any = {
          Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
          Action: getActionLabel(log.action),
          Quantity: log.quantity,
        };

        if (log.productName) {
          baseData['Product Name'] = log.productName;
        }

        if (log.materialName) {
          baseData['Material Name'] = log.materialName;
        }

        if (log.packagingName) {
          baseData['Packaging Name'] = log.packagingName;
        }

        if (log.description) {
          baseData['Description'] = log.description;
        }

        if (log.affectedMaterials && log.affectedMaterials.length > 0) {
          baseData['Affected Materials'] = log.affectedMaterials
            .map((m) => `${m.materialName} (${m.quantity})`)
            .join(', ');
        }

        return baseData;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Log');

      const dateRangeStr = exportStartDate || exportEndDate
        ? `_${exportStartDate ? format(exportStartDate, 'MMddyyyy') : 'Start'}_to_${exportEndDate ? format(exportEndDate, 'MMddyyyy') : 'End'}`
        : '';

      const fileName = `Mnemosyne_Activity_Log${dateRangeStr}_${format(
        new Date(),
        'yyyy-MM-dd_HHmmss'
      )}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success(`Exported ${logsToExport.length} records to Excel successfully!`);
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export to Excel. Please try again.');
    }
  };

  const exportToPDF = () => {
    try {
      console.log('🔍 Starting PDF export...');
      
      // Filter logs based on export date range
      const logsToExport = activityLog.filter((log) => {
        if (!exportStartDate && !exportEndDate) return true;

        const logDate = new Date(log.timestamp);
        logDate.setHours(0, 0, 0, 0);

        if (exportStartDate && exportEndDate) {
          const start = new Date(exportStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(exportEndDate);
          end.setHours(23, 59, 59, 999);
          return logDate >= start && logDate <= end;
        }

        if (exportStartDate) {
          const start = new Date(exportStartDate);
          start.setHours(0, 0, 0, 0);
          return logDate >= start;
        }

        if (exportEndDate) {
          const end = new Date(exportEndDate);
          end.setHours(23, 59, 59, 999);
          return logDate <= end;
        }

        return true;
      });

      console.log('🔍 Logs to export:', logsToExport.length);

      if (logsToExport.length === 0) {
        toast.error('No data to export for selected date range');
        return;
      }

      console.log('🔍 Creating PDF document...');
      const doc = new jsPDF();
      
      // Add title and header information
      doc.setFontSize(18);
      doc.setTextColor(10, 38, 71); // Mnemosyne navy blue
      doc.text('Mnemosyne Activity Log', 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      if (exportStartDate || exportEndDate) {
        const dateRangeText = `Date Range: ${exportStartDate ? format(exportStartDate, 'MMM dd, yyyy') : 'Start'} - ${exportEndDate ? format(exportEndDate, 'MMM dd, yyyy') : 'End'}`;
        doc.text(dateRangeText, 14, 22);
        doc.text(`Total Records: ${logsToExport.length}`, 14, 27);
      } else {
        doc.text(`Total Records: ${logsToExport.length}`, 14, 22);
      }

      console.log('🔍 Preparing table data...');
      const exportData = logsToExport.map((log) => {
        return [
          format(new Date(log.timestamp), 'MM/dd/yy HH:mm'),
          getActionLabel(log.action),
          (log.quantity || 0).toString(),
          log.productName || log.materialName || log.packagingName || '-',
          log.description || '-',
        ];
      });

      console.log('🔍 Adding table to PDF...');
      autoTable(doc, {
        head: [
          ['Timestamp', 'Action', 'Qty', 'Item', 'Description'],
        ],
        body: exportData,
        startY: exportStartDate || exportEndDate ? 32 : 27,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: { 
          fillColor: [10, 38, 71], // Mnemosyne navy blue
          textColor: [212, 175, 55], // Mnemosyne gold
          fontStyle: 'bold',
        },
        alternateRowStyles: { 
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Timestamp
          1: { cellWidth: 35 }, // Action
          2: { cellWidth: 15 }, // Quantity
          3: { cellWidth: 45 }, // Item
          4: { cellWidth: 'auto' }, // Description
        },
      });

      const dateRangeStr = exportStartDate || exportEndDate
        ? `_${exportStartDate ? format(exportStartDate, 'MMddyyyy') : 'Start'}_to_${exportEndDate ? format(exportEndDate, 'MMddyyyy') : 'End'}`
        : '';

      const fileName = `Mnemosyne_Activity_Log${dateRangeStr}_${format(
        new Date(),
        'yyyy-MM-dd_HHmmss'
      )}.pdf`;

      console.log('🔍 Saving PDF file:', fileName);
      doc.save(fileName);
      
      console.log('✅ PDF export completed successfully');
      toast.success(`Exported ${logsToExport.length} records to PDF successfully!`);
    } catch (error) {
      console.error('❌ PDF export error:', error);
      toast.error('Failed to export to PDF. Please try again.');
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'PRODUCT_ADDED':
        return 'Product Added';
      case 'PRODUCT_DEDUCTED':
        return 'Product Used';
      case 'MATERIAL_ADDED':
        return 'Material Added';
      case 'MATERIAL_DEDUCTED':
        return 'Material Deducted';
      case 'PACKAGING_ADDED':
        return 'Packaging Added';
      case 'PACKAGING_USED':
        return 'Packaging Used';
      default:
        return action;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'PRODUCT_ADDED':
        return <Plus className="w-4 h-4" />;
      case 'PRODUCT_DEDUCTED':
        return <Minus className="w-4 h-4" />;
      case 'MATERIAL_ADDED':
        return <Plus className="w-4 h-4" />;
      case 'MATERIAL_DEDUCTED':
        return <Minus className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'PRODUCT_ADDED':
      case 'MATERIAL_ADDED':
      case 'PACKAGING_ADDED':
        return 'bg-gradient-to-br from-green-500 to-green-600';
      case 'PRODUCT_DEDUCTED':
      case 'MATERIAL_DEDUCTED':
      case 'PACKAGING_USED':
        return 'bg-gradient-to-br from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/95 to-primary/80 rounded-2xl p-8 shadow-xl border border-secondary/20">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-2 tracking-wide">
              Activity Log
            </h2>
            <p className="text-secondary/80 text-sm tracking-wider">Track all inventory transactions and updates</p>
          </div>
          
          <div className="flex gap-3 flex-wrap items-center">
            {/* Date Filters */}
            <div className="flex gap-2 items-center bg-white/10 backdrop-blur-sm border border-secondary/30 rounded-xl p-2.5">
              <div className="bg-secondary/20 p-1.5 rounded-lg">
                <Filter className="w-3.5 h-3.5 text-secondary" />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="cursor-pointer border-secondary/50 hover:border-secondary hover:bg-secondary/10 transition-all bg-white/90 text-primary"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    <span className="text-xs font-medium">
                      {startDate ? format(startDate, 'MMM dd, yyyy') : 'Start Date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <span className="text-xs text-secondary/60 font-semibold">→</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="cursor-pointer border-secondary/50 hover:border-secondary hover:bg-secondary/10 transition-all bg-white/90 text-primary"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    <span className="text-xs font-medium">
                      {endDate ? format(endDate, 'MMM dd, yyyy') : 'End Date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="cursor-pointer hover:bg-red-500/20 hover:text-white transition-all h-8 px-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Export Button */}
            <Button
              onClick={() => setIsExportDialogOpen(true)}
              className="cursor-pointer flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Filter Status Banner */}
        {(startDate || endDate) && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm border border-secondary/30 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-1.5 rounded-lg">
                <Filter className="w-3.5 h-3.5 text-secondary" />
              </div>
              <span className="text-sm font-semibold text-secondary">
                Showing <span className="text-white">{filteredLog.length}</span> of <span className="text-white">{activityLog.length}</span> records
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Combined Activity Card with Tabs */}
      <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-white border-b-2 border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('recent')}
              className={`cursor-pointer flex-1 px-6 py-4 font-semibold text-base transition-all ${
                activeTab === 'recent'
                  ? 'bg-primary text-secondary border-b-4 border-secondary'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activity</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`cursor-pointer flex-1 px-6 py-4 font-semibold text-base transition-all ${
                activeTab === 'stock'
                  ? 'bg-primary text-secondary border-b-4 border-secondary'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PackageOpen className="w-5 h-5" />
                <span>Material Stock Addition</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <CardContent className="p-0">
          {/* Recent Activity Tab */}
          {activeTab === 'recent' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-hide"
            >
              {generalActivities.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {generalActivities.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all group cursor-pointer"
                      onClick={() => handleActivityClick(log)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`${getActionColor(log.action)} p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0`}>
                          {log.action.includes('PRODUCT') ? (
                            <Package className="w-4 h-4 text-white" />
                          ) : (
                            <PackageOpen className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            {/* Show item name as main heading */}
                            <h4 className="font-bold text-gray-900 text-base">
                              {log.productName || log.materialName || log.packagingName || getActionLabel(log.action)}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {/* Show quantity badge only */}
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant={log.action.includes('ADDED') ? 'default' : 'destructive'}
                                className="text-sm font-semibold"
                              >
                                {log.action.includes('ADDED') ? '+' : '-'}{log.quantity}
                              </Badge>
                            </div>

                            {/* Description - Display for all actions, particularly deductions */}
                            {log.description && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                                  {log.description}
                                </p>
                              </div>
                            )}

                            {log.affectedMaterials && log.affectedMaterials.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs font-semibold text-primary mb-2">
                                  Materials Used:
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                  {log.affectedMaterials.map((material, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                                    >
                                      <span className="text-xs font-medium text-gray-700">
                                        {material.materialName}
                                      </span>
                                      <Badge variant="destructive" className="text-xs">
                                        -{material.quantity}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Material Stock Addition Tab */}
          {activeTab === 'stock' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[calc(100vh-350px)] overflow-y-auto scrollbar-hide"
            >
              {materialStockAdditions.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <PackageOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No stock additions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {materialStockAdditions.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-4 hover:bg-gradient-to-r hover:from-secondary/5 hover:to-transparent transition-all group cursor-pointer"
                      onClick={() => handleActivityClick(log)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                          <Plus className="w-4 h-4 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-base truncate">
                                {log.materialName}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {format(new Date(log.timestamp), 'MMM dd, yyyy • HH:mm:ss')}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-green-900">
                                Stock Added
                              </span>
                              <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4 text-green-600" />
                                <span className="text-2xl font-bold text-green-600">
                                  {log.quantity}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Show click hint on hover */}
                          <p className="text-xs text-primary/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view details
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Download className="w-6 h-6 text-secondary" />
              Export Activity Log
            </DialogTitle>
            <DialogDescription className="text-base">
              Choose a date range and export format (PDF or Excel)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Date Range Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Date Range (Optional)
              </Label>
              <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="cursor-pointer flex-1 justify-start text-left font-normal hover:bg-white"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm">
                        {exportStartDate ? format(exportStartDate, 'MMM dd, yyyy') : 'Start Date'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={exportStartDate}
                      onSelect={setExportStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <span className="text-gray-400 font-bold">→</span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="cursor-pointer flex-1 justify-start text-left font-normal hover:bg-white"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm">
                        {exportEndDate ? format(exportEndDate, 'MMM dd, yyyy') : 'End Date'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={exportEndDate}
                      onSelect={setExportEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {(exportStartDate || exportEndDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExportStartDate(undefined);
                      setExportEndDate(undefined);
                      toast.info('Date range cleared');
                    }}
                    className="cursor-pointer hover:bg-red-100 hover:text-red-600 transition-all h-10 px-3"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {!exportStartDate && !exportEndDate && (
                <p className="text-xs text-gray-500 italic">
                  Leave blank to export all records
                </p>
              )}
            </div>

            {/* Format Selection Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Export Format
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Excel Option */}
                <button
                  onClick={() => setExportFormat('excel')}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                    exportFormat === 'excel'
                      ? 'border-secondary bg-secondary/10 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-secondary/50 hover:bg-secondary/5'
                  }`}
                >
                  <FileSpreadsheet className={`w-10 h-10 ${
                    exportFormat === 'excel' ? 'text-secondary' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <p className={`font-semibold ${
                      exportFormat === 'excel' ? 'text-primary' : 'text-gray-700'
                    }`}>
                      Excel
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.xlsx file</p>
                  </div>
                  {exportFormat === 'excel' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-secondary rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>

                {/* PDF Option */}
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all relative ${
                    exportFormat === 'pdf'
                      ? 'border-secondary bg-secondary/10 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-secondary/50 hover:bg-secondary/5'
                  }`}
                >
                  <FileText className={`w-10 h-10 ${
                    exportFormat === 'pdf' ? 'text-secondary' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <p className={`font-semibold ${
                      exportFormat === 'pdf' ? 'text-primary' : 'text-gray-700'
                    }`}>
                      PDF
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.pdf file</p>
                  </div>
                  {exportFormat === 'pdf' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-secondary rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (exportFormat === 'excel') {
                  exportToExcel();
                } else {
                  exportToPDF();
                }
                setIsExportDialogOpen(false);
              }}
              className="cursor-pointer flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary"
            >
              <Download className="w-4 h-4" />
              <span>Export as {exportFormat === 'excel' ? 'Excel' : 'PDF'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Activity className="w-6 h-6 text-secondary" />
              Activity Details
            </DialogTitle>
            <DialogDescription className="text-base">
              Complete information about this activity
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-5 py-4">
              {/* Header Card with Action Type */}
              <div className={`${getActionColor(selectedActivity.action)} rounded-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      {selectedActivity.action.includes('ADDED') ? (
                        <Plus className="w-6 h-6 text-white" />
                      ) : (
                        <Minus className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {getActionLabel(selectedActivity.action)}
                      </h3>
                      <p className="text-white/80 text-sm mt-1">
                        {format(new Date(selectedActivity.timestamp), 'MMMM dd, yyyy • HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <p className="text-white/70 text-xs font-semibold">ID</p>
                    <p className="text-white text-sm font-mono">{selectedActivity.id?.slice(0, 8)}</p>
                  </div>
                </div>
              </div>

              {/* Item Information Card */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-primary text-lg">
                    {selectedActivity.action.includes('ADDED') ? 'Stock Addition' : 'Item Usage'}
                  </h4>
                </div>
                
                <div className="space-y-4">
                  {/* Quantity Only */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Quantity {selectedActivity.action.includes('ADDED') ? 'Added' : 'Used'}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={selectedActivity.action.includes('ADDED') ? 'default' : 'destructive'}
                        className="text-lg px-3 py-1"
                      >
                        {selectedActivity.action.includes('ADDED') ? '+' : '-'}{selectedActivity.quantity || selectedActivity.quantity_change ? Math.abs(selectedActivity.quantity || selectedActivity.quantity_change || 0) : 0}
                      </Badge>
                    </div>
                  </div>

                  {/* Show material info for raw material or packaging material deductions */}
                  {(selectedActivity.action.includes('Deducted Raw Material') || 
                    selectedActivity.action.includes('Deducted Packaging Material') ||
                    selectedActivity.action === 'MATERIAL_DEDUCTED') && 
                   selectedActivity.details && (
                    <div className="pt-4 border-t-2 border-primary/20">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        {selectedActivity.action.includes('Raw Material') || selectedActivity.action === 'MATERIAL_DEDUCTED' ? 'Raw Material Deduction Details' : 'Packaging Material Deduction Details'}
                      </Label>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <PackageOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">
                              {selectedActivity.details}
                            </p>
                          </div>
                        </div>
                        
                        {/* Stock Information Display */}
                        {(selectedActivity.previousStock !== undefined && selectedActivity.newStock !== undefined) && (
                          <div className="bg-white/80 rounded-lg p-3 mt-2 space-y-2">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-green-50 border border-green-200 rounded-md p-2">
                                <p className="text-xs text-green-600 font-semibold uppercase mb-1">Previous Stock</p>
                                <p className="text-lg font-bold text-green-700">{selectedActivity.previousStock}</p>
                              </div>
                              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                                <p className="text-xs text-red-600 font-semibold uppercase mb-1">Deducted</p>
                                <p className="text-lg font-bold text-red-700">-{selectedActivity.quantity || selectedActivity.quantity_change ? Math.abs(selectedActivity.quantity || selectedActivity.quantity_change || 0) : 0}</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">New Stock</p>
                                <p className="text-lg font-bold text-blue-700">{selectedActivity.newStock}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show raw materials used for finished product deductions */}
                  {selectedActivity.action === 'PRODUCT_DEDUCTED' && 
                   selectedActivity.affectedMaterials && 
                   selectedActivity.affectedMaterials.length > 0 && (
                    <div className="pt-4 border-t-2 border-primary/20">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        Materials Used (Bill of Materials & Add-ons)
                      </Label>
                      <div className="space-y-2">
                        {selectedActivity.affectedMaterials.map((material, idx) => {
                          // Check if this is an add-on
                          const isAddOn = material.materialName.includes('(Add-on)');
                          
                          return (
                            <div
                              key={idx}
                              className={`flex items-center justify-between ${
                                isAddOn 
                                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300' 
                                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200'
                              } rounded-lg px-4 py-3`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`${isAddOn ? 'bg-purple-100' : 'bg-orange-100'} p-1.5 rounded-lg`}>
                                  <PackageOpen className={`w-4 h-4 ${isAddOn ? 'text-purple-600' : 'text-orange-600'}`} />
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-gray-900">
                                    {material.materialName}
                                  </span>
                                  {isAddOn && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-xs text-purple-600 font-semibold">✨ Additional Material</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-sm font-bold ${
                                  isAddOn 
                                    ? 'border-purple-300 text-purple-700 bg-white' 
                                    : 'border-orange-300 text-orange-700 bg-white'
                                }`}
                              >
                                × {material.quantity}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Show materials for finished product additions - need to fetch BOM */}
                  {selectedActivity.action === 'Added Finished Product' && selectedActivity.item_id && (
                    <div className="pt-4 border-t-2 border-primary/20">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        Materials/Add-ons in This Product
                      </Label>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-700">
                            View this product's Bill of Materials in the Finished Products tab
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category if available */}
                  {selectedActivity.category && (
                    <div className="pt-4 border-t border-gray-200">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Category
                      </Label>
                      <p className="text-sm text-gray-700 mt-1">
                        {selectedActivity.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description/Details Card */}
              {(selectedActivity.description || selectedActivity.details) && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-900 text-lg">
                      {selectedActivity.action.includes('DEDUCTED') || selectedActivity.action.includes('USED') 
                        ? 'Reason for Deduction' 
                        : 'Additional Details'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg px-4 py-3 border border-blue-200">
                    {selectedActivity.description || selectedActivity.details}
                  </p>
                </div>
              )}

              {/* Affected Materials Card - Enhanced */}
              {selectedActivity.affectedMaterials && selectedActivity.affectedMaterials.length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <PackageOpen className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 text-lg">
                        Materials Automatically Deducted
                      </h4>
                      <p className="text-xs text-red-700 mt-1">
                        These materials were deducted from inventory due to this activity
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedActivity.affectedMaterials.map((material, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border-2 border-red-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-red-100 p-2 rounded-lg">
                              <PackageOpen className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 truncate">
                                {material.materialName}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Bill of Materials Component
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Minus className="w-4 h-4 text-red-600" />
                            <Badge variant="destructive" className="text-base font-bold px-3 py-1">
                              {material.quantity}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t-2 border-red-200 bg-red-100 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-red-900">
                        Total Materials Affected:
                      </span>
                      <span className="text-lg font-bold text-red-900">
                        {selectedActivity.affectedMaterials.length} {selectedActivity.affectedMaterials.length === 1 ? 'Material' : 'Materials'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 border-t pt-4">
            <Button
              type="button"
              onClick={() => setIsDetailDialogOpen(false)}
              className="cursor-pointer bg-primary hover:bg-primary/90 text-secondary px-6"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}