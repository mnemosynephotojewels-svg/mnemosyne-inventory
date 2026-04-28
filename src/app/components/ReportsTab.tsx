import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search, TrendingUp, Package, PackageOpen, Box, Download, Calendar as CalendarIcon, Filter, X, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { ActivityLog, FinishedProduct, RawMaterial, PackagingMaterial } from '../types/inventory';
import { motion, AnimatePresence } from 'motion/react';
import { ExportFilterDialog } from './ExportFilterDialog';
import { format, startOfDay, endOfDay, subDays, subMonths, subYears, isWithinInterval, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportsTabProps {
  activityLog: ActivityLog[];
  finishedProducts: FinishedProduct[];
  rawMaterials: RawMaterial[];
  packagingMaterials: PackagingMaterial[];
}

type ReportType = 'finished' | 'raw' | 'packaging';
type TimeFilter = 'name' | 'weekly' | 'monthly' | 'yearly';
type DatePreset = 'today' | '7days' | '30days' | '3months' | '1year' | 'custom' | 'all';

interface UsageStats {
  name: string;
  weekly: number;
  monthly: number;
  yearly: number;
  total: number;
  category?: string;
  subCategory?: string;
}

// Finished Products Sub-categories
const FINISHED_PRODUCT_SUBCATEGORIES = {
  'Jewels Products': [
    'Engraved Photo Memory Necklace',
    'Photo Memory (Resin) Necklace',
    'Photo Memory Locket Necklace',
    'Engraved Bar Necklace',
    'Photo Memory Brooch',
    'Engraved Photo Keychain',
    'Engraved Bar Bracelet',
    'Engraved Photo Memory Bracelet',
    'Photo Memory (Resin) Bracelet'
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

const CHART_COLORS = ['#0a2647', '#d4af37', '#1e5f74', '#f4e5c3', '#2d8ba8', '#c99a3a', '#0d3d5c', '#e8d4a0'];

export function ReportsTab({ activityLog, finishedProducts, rawMaterials, packagingMaterials }: ReportsTabProps) {
  const [reportType, setReportType] = useState<ReportType>('finished');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Date filter states
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Category filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Export states
  const [showExportFilterForm, setShowExportFilterForm] = useState(false);
  
  // Export filter states (independent from main filters)
  const [exportDatePreset, setExportDatePreset] = useState<DatePreset>('all');
  const [exportStartDate, setExportStartDate] = useState<string>('');
  const [exportEndDate, setExportEndDate] = useState<string>('');
  const [exportCategory, setExportCategory] = useState<string>('all');
  const [exportSubCategory, setExportSubCategory] = useState<string>('all');

  // Calculate date ranges
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Get available categories based on report type
  const availableCategories = useMemo(() => {
    if (reportType === 'finished') {
      return Object.keys(FINISHED_PRODUCT_SUBCATEGORIES);
    } else if (reportType === 'raw') {
      return Array.from(new Set(rawMaterials.map(m => m.category).filter(Boolean))) as string[];
    }
    return [];
  }, [reportType, rawMaterials]);

  // Get available sub-categories based on selected category
  const availableSubCategories = useMemo(() => {
    if (reportType === 'finished' && selectedCategory !== 'all') {
      return FINISHED_PRODUCT_SUBCATEGORIES[selectedCategory as keyof typeof FINISHED_PRODUCT_SUBCATEGORIES] || [];
    }
    return [];
  }, [reportType, selectedCategory]);

  // Handle date preset changes
  const handleDatePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    const today = new Date();
    
    switch (preset) {
      case 'today':
        setStartDate(format(startOfDay(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfDay(today), 'yyyy-MM-dd'));
        break;
      case '7days':
        setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case '30days':
        setStartDate(format(subDays(today, 30), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case '3months':
        setStartDate(format(subMonths(today, 3), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case '1year':
        setStartDate(format(subYears(today, 1), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'all':
        setStartDate('');
        setEndDate('');
        break;
      case 'custom':
        // Keep current dates
        break;
    }
  };

  // Filter activity logs by date range
  const dateFilteredLogs = useMemo(() => {
    if (!startDate || !endDate || datePreset === 'all') {
      return activityLog;
    }

    const start = parseISO(startDate);
    const end = endOfDay(parseISO(endDate));

    return activityLog.filter(log => {
      const logDate = new Date(log.timestamp);
      return isWithinInterval(logDate, { start, end });
    });
  }, [activityLog, startDate, endDate, datePreset]);

  // Calculate usage statistics based on report type
  const usageStats = useMemo(() => {
    const stats = new Map<string, UsageStats>();

    console.log('🔍 USAGE STATS CALCULATION');
    console.log('Report Type:', reportType);
    console.log('Date Filtered Logs:', dateFilteredLogs.length);
    console.log('Raw Materials:', rawMaterials.length);
    console.log('Finished Products:', finishedProducts.length);
    console.log('Packaging Materials:', packagingMaterials.length);

    // Initialize stats for all items
    if (reportType === 'finished') {
      finishedProducts.forEach(product => {
        stats.set(product.name, {
          name: product.name,
          weekly: 0,
          monthly: 0,
          yearly: 0,
          total: 0,
          category: product.category,
          subCategory: product.subCategory,
        });
      });
    } else if (reportType === 'raw') {
      rawMaterials.forEach(material => {
        stats.set(material.name, {
          name: material.name,
          weekly: 0,
          monthly: 0,
          yearly: 0,
          total: 0,
          category: material.category,
        });
      });
    } else if (reportType === 'packaging') {
      packagingMaterials.forEach(material => {
        stats.set(material.name, {
          name: material.name,
          weekly: 0,
          monthly: 0,
          yearly: 0,
          total: 0,
        });
      });
    }

    // Calculate usage from activity log
    dateFilteredLogs.forEach(log => {
      const logDate = new Date(log.timestamp);
      
      console.log('🔎 Processing log:', {
        action: log.action,
        productName: log.productName,
        materialName: log.materialName,
        packagingName: log.packagingName,
        quantity: log.quantity,
        affectedMaterials: log.affectedMaterials
      });

      if (reportType === 'finished') {
        // Track finished product usage
        if (log.productName && log.action === 'PRODUCT_DEDUCTED') {
          const quantity = log.quantity || 0;
          const product = finishedProducts.find(p => p.name === log.productName);
          const stat = stats.get(log.productName) || {
            name: log.productName,
            weekly: 0,
            monthly: 0,
            yearly: 0,
            total: 0,
            category: product?.category,
            subCategory: product?.subCategory,
          };

          stat.total += quantity;
          if (logDate >= oneWeekAgo) stat.weekly += quantity;
          if (logDate >= oneMonthAgo) stat.monthly += quantity;
          if (logDate >= oneYearAgo) stat.yearly += quantity;

          stats.set(log.productName, stat);
          console.log(`📊 Finished Product Usage: ${log.productName} +${quantity} (Total: ${stat.total})`);
        }
      } else if (reportType === 'raw') {
        // Track raw material usage from direct deductions
        if (log.materialName && log.action === 'MATERIAL_DEDUCTED') {
          const quantity = log.quantity || 0;
          const material = rawMaterials.find(m => m.name === log.materialName);
          const stat = stats.get(log.materialName) || {
            name: log.materialName,
            weekly: 0,
            monthly: 0,
            yearly: 0,
            total: 0,
            category: material?.category,
          };

          stat.total += quantity;
          if (logDate >= oneWeekAgo) stat.weekly += quantity;
          if (logDate >= oneMonthAgo) stat.monthly += quantity;
          if (logDate >= oneYearAgo) stat.yearly += quantity;

          stats.set(log.materialName, stat);
          console.log(`📊 Raw Material Deduction: ${log.materialName} +${quantity} (Total: ${stat.total})`);
        }
        
        // Explicitly skip MATERIAL_ADDED actions (these are stock additions, not usage)
        if (log.action === 'MATERIAL_ADDED') {
          console.log(`⏭️ Skipping MATERIAL_ADDED (not usage): ${log.materialName}`);
        }

        // Track raw materials used by finished products (from bill of materials)
        if (log.action === 'PRODUCT_DEDUCTED' && log.affectedMaterials) {
          console.log(`📦 Processing BOM for product deduction:`, log.affectedMaterials);
          log.affectedMaterials.forEach(affected => {
            const material = rawMaterials.find(m => m.name === affected.materialName);
            const stat = stats.get(affected.materialName) || {
              name: affected.materialName,
              weekly: 0,
              monthly: 0,
              yearly: 0,
              total: 0,
              category: material?.category,
            };

            const quantity = affected.quantity || 0;
            stat.total += quantity;
            if (logDate >= oneWeekAgo) stat.weekly += quantity;
            if (logDate >= oneMonthAgo) stat.monthly += quantity;
            if (logDate >= oneYearAgo) stat.yearly += quantity;

            stats.set(affected.materialName, stat);
            console.log(`📊 Raw Material from BOM: ${affected.materialName} +${quantity} (Total: ${stat.total})`);
          });
        }
      } else if (reportType === 'packaging') {
        // Track packaging material usage
        if (log.packagingName && log.action === 'PACKAGING_USED') {
          const quantity = log.quantity || 0;
          const stat = stats.get(log.packagingName) || {
            name: log.packagingName,
            weekly: 0,
            monthly: 0,
            yearly: 0,
            total: 0,
          };

          stat.total += quantity;
          if (logDate >= oneWeekAgo) stat.weekly += quantity;
          if (logDate >= oneMonthAgo) stat.monthly += quantity;
          if (logDate >= oneYearAgo) stat.yearly += quantity;

          stats.set(log.packagingName, stat);
          console.log(`📊 Packaging Usage: ${log.packagingName} +${quantity} (Total: ${stat.total})`);
        }
      }
    });

    const result = Array.from(stats.values());
    console.log('✅ Final Usage Stats:', result.length, 'items');
    console.log('Sample stats:', result.slice(0, 3));
    return result;
  }, [dateFilteredLogs, reportType, finishedProducts, rawMaterials, packagingMaterials, oneWeekAgo, oneMonthAgo, oneYearAgo]);

  // Filter stats based on search query and categories
  const filteredStats = useMemo(() => {
    return usageStats.filter(stat => {
      // Search filter
      const matchesSearch = stat.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        if (reportType === 'finished') {
          matchesCategory = stat.category === selectedCategory;
        } else if (reportType === 'raw') {
          matchesCategory = stat.category === selectedCategory;
        }
      }
      
      // Sub-category filter
      let matchesSubCategory = true;
      if (selectedSubCategory !== 'all' && reportType === 'finished') {
        matchesSubCategory = stat.subCategory === selectedSubCategory;
      }
      
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [usageStats, searchQuery, selectedCategory, selectedSubCategory, reportType]);

  // Sort by selected time filter
  const sortedStats = useMemo(() => {
    const sorted = [...filteredStats];
    if (timeFilter === 'name') {
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted.sort((a, b) => b[timeFilter] - a[timeFilter]);
  }, [filteredStats, timeFilter]);

  // Get most used items (top 5)
  const mostUsed = useMemo(() => {
    return [...filteredStats]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredStats]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Filter to only include items with actual usage based on current time filter
    const dataWithUsage = sortedStats.filter(stat => {
      if (timeFilter === 'weekly') return stat.weekly > 0;
      if (timeFilter === 'monthly') return stat.monthly > 0;
      if (timeFilter === 'yearly') return stat.yearly > 0;
      return stat.weekly > 0 || stat.monthly > 0 || stat.yearly > 0;
    }).slice(0, 10);
    
    // Create chart data with guaranteed unique names and IDs
    return dataWithUsage.map((stat, index) => {
      // Truncate long names
      let displayName = stat.name.length > 15 ? stat.name.substring(0, 15) + '...' : stat.name;
      
      // Add index to ensure uniqueness - this guarantees no duplicates
      displayName = `${displayName} [${index + 1}]`;
      
      // Create a unique ID for Recharts to use internally
      const uniqueId = `${stat.name.replace(/\s/g, '_')}_${index}_${stat.weekly}_${stat.monthly}_${stat.yearly}`;
      
      return {
        id: uniqueId,
        name: displayName,
        fullName: stat.name,
        Weekly: stat.weekly,
        Monthly: stat.monthly,
        Yearly: stat.yearly,
      };
    });
  }, [sortedStats, timeFilter]);

  // Category distribution pie chart data — REMOVED

  // Export to Excel
  const handleExportToExcel = () => {
    try {
      const exportData = sortedStats.map(stat => ({
        Name: stat.name,
        Category: stat.category || 'N/A',
        'Sub-Category': stat.subCategory || 'N/A',
        Weekly: stat.weekly,
        Monthly: stat.monthly,
        Yearly: stat.yearly,
        Total: stat.total,
      }));

      if (exportData.length === 0) {
        toast.error('No data to export');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usage Report');
      
      const fileName = `${getReportTitle()}_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success(`Exported ${exportData.length} records to Excel successfully!`);
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export to Excel. Please try again.');
    }
  };

  // Export to PDF
  const handleExportToPDF = () => {
    try {
      console.log('🔍 Starting Reports PDF export...');
      
      const doc = new jsPDF();
      const reportTitle = getReportTitle();
      const dateRange = datePreset === 'custom' 
        ? `${startDate} to ${endDate}` 
        : datePreset === 'today' ? 'Today'
        : datePreset === '7days' ? 'Last 7 Days'
        : datePreset === '30days' ? 'Last 30 Days'
        : datePreset === '3months' ? 'Last 3 Months'
        : 'Last Year';

      // Add title and date range
      doc.setFontSize(16);
      doc.text(`${reportTitle} Usage Report`, 14, 20);
      doc.setFontSize(12);
      doc.text(`Date Range: ${dateRange}`, 14, 30);

      // Add table
      const tableData = sortedStats.map(stat => [
        stat.name,
        stat.category || 'N/A',
        stat.subCategory || 'N/A',
        stat.weekly,
        stat.monthly,
        stat.yearly,
        stat.total,
      ]);

      console.log('🔍 Adding table to Reports PDF...');
      autoTable(doc, {
        head: [['Name', 'Category', 'Sub-Category', 'Weekly', 'Monthly', 'Yearly', 'Total']],
        body: tableData,
        startY: 40,
        margin: { top: 40 },
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [10, 38, 71],
          textColor: 255,
          fontSize: 10,
          cellPadding: 3,
        },
      });

      const fileName = `${reportTitle}_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
      console.log('🔍 Saving Reports PDF file:', fileName);
      doc.save(fileName);
      
      console.log('✅ Reports PDF export completed successfully');
      toast.success(`Exported ${sortedStats.length} records to PDF successfully!`);
    } catch (error) {
      console.error('❌ Reports PDF export error:', error);
      toast.error('Failed to export to PDF. Please try again.');
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = datePreset !== 'all' || selectedCategory !== 'all' || selectedSubCategory !== 'all' || searchQuery !== '';

  const getReportIcon = () => {
    switch (reportType) {
      case 'finished':
        return <Package className="w-5 h-5" />;
      case 'raw':
        return <PackageOpen className="w-5 h-5" />;
      case 'packaging':
        return <Box className="w-5 h-5" />;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'finished':
        return 'Finished Products';
      case 'raw':
        return 'Raw Materials';
      case 'packaging':
        return 'Packaging Materials';
    }
  };

  // Reset filters when report type changes
  const handleReportTypeChange = (value: ReportType) => {
    setReportType(value);
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-secondary/20">
        <div className="space-y-6">
          {/* Header with Dropdown */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg">
                {getReportIcon()}
                <span className="sr-only">{getReportTitle()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">Usage Reports</h2>
                <p className="text-sm text-gray-600 mt-1">Track inventory usage with advanced filtering</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Export Button */}
              <Button
                onClick={() => {
                  // Initialize export filters with current view filters
                  setExportDatePreset(datePreset);
                  setExportStartDate(startDate);
                  setExportEndDate(endDate);
                  setExportCategory(selectedCategory);
                  setExportSubCategory(selectedSubCategory);
                  setShowExportFilterForm(true);
                }}
                variant="outline"
                className="border-2 border-secondary/50 hover:bg-secondary/10 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              {/* Report Type Selector */}
              <Select value={reportType} onValueChange={(value: ReportType) => handleReportTypeChange(value)}>
                <SelectTrigger className="w-64 border-2 border-secondary/30 bg-white hover:border-secondary/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finished">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Finished Products
                    </div>
                  </SelectItem>
                  <SelectItem value="raw">
                    <div className="flex items-center gap-2">
                      <PackageOpen className="w-4 h-4" />
                      Raw Materials
                    </div>
                  </SelectItem>
                  <SelectItem value="packaging">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Packaging Materials
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="border-2 border-secondary/20 bg-gradient-to-r from-gray-50 to-white">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Preset Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <Select value={datePreset} onValueChange={(value: DatePreset) => handleDatePresetChange(value)}>
                    <SelectTrigger className="border-2 border-gray-200 bg-white hover:border-secondary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Date Inputs */}
                <AnimatePresence>
                  {datePreset === 'custom' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="border-2 border-gray-200 focus:border-secondary/50 text-black [color-scheme:light]"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="border-2 border-gray-200 focus:border-secondary/50 text-black [color-scheme:light]"
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Category Filter */}
                {(reportType === 'finished' || reportType === 'raw') && availableCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="border-2 border-gray-200 bg-white hover:border-secondary/50 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {availableCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sub-category Filter */}
                {reportType === 'finished' && selectedCategory !== 'all' && availableSubCategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
                    <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                      <SelectTrigger className="border-2 border-gray-200 bg-white hover:border-secondary/50 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sub-Categories</SelectItem>
                        {availableSubCategories.map(subCat => (
                          <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}

                {/* Search Bar */}
                <div className={datePreset === 'custom' ? 'md:col-span-2 lg:col-span-1' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-2 border-gray-200 focus:border-secondary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {datePreset !== 'all' && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {datePreset === 'custom' 
                          ? `${startDate} to ${endDate}` 
                          : datePreset === 'today' ? 'Today'
                          : datePreset === '7days' ? 'Last 7 Days'
                          : datePreset === '30days' ? 'Last 30 Days'
                          : datePreset === '3months' ? 'Last 3 Months'
                          : 'Last Year'
                        }
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="px-3 py-1 bg-secondary/20 text-primary rounded-full text-sm font-medium">
                        {selectedCategory}
                      </span>
                    )}
                    {selectedSubCategory !== 'all' && (
                      <span className="px-3 py-1 bg-secondary/30 text-primary rounded-full text-sm font-medium">
                        {selectedSubCategory}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Search: "{searchQuery}"
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Charts Section */}
          {/* Temporarily disabled due to Recharts internal key warnings
          {chartData.length > 0 && (() => {
            const hasValidData = chartData.some(item => 
              item.Weekly > 0 || item.Monthly > 0 || item.Yearly > 0
            );
            
            if (!hasValidData) return null;
            
            const chartKey = `chart-${reportType}-${timeFilter}-${chartData.map(d => d.name).join('-')}`;
            
            return (
              <div key={chartKey}>
                <Card className="border-2 border-gray-200 shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                    <h3 className="text-lg font-semibold text-secondary">Top 10 Usage Trends</h3>
                  </div>
                  <div className="p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '12px' }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Weekly" fill="#2d8ba8" />
                        <Bar dataKey="Monthly" fill="#d4af37" />
                        <Bar dataKey="Yearly" fill="#0a2647" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            );
          })()}
          */}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Usage Table */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-secondary">Usage Statistics</h3>
                    <span className="px-3 py-1 bg-secondary rounded-full text-primary text-sm font-semibold">
                      {filteredStats.length} items
                    </span>
                  </div>
                </div>

                {/* Time Filter Tabs */}
                <div className="grid grid-cols-4 border-b-2 border-gray-200">
                  <button
                    onClick={() => setTimeFilter('name')}
                    className={`py-3 px-4 font-semibold text-sm transition-all ${
                      timeFilter === 'name'
                        ? 'bg-secondary text-primary border-b-4 border-primary'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    NAME
                  </button>
                  <button
                    onClick={() => setTimeFilter('weekly')}
                    className={`py-3 px-4 font-semibold text-sm transition-all ${
                      timeFilter === 'weekly'
                        ? 'bg-secondary text-primary border-b-4 border-primary'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    WEEKLY
                  </button>
                  <button
                    onClick={() => setTimeFilter('monthly')}
                    className={`py-3 px-4 font-semibold text-sm transition-all ${
                      timeFilter === 'monthly'
                        ? 'bg-secondary text-primary border-b-4 border-primary'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    MONTHLY
                  </button>
                  <button
                    onClick={() => setTimeFilter('yearly')}
                    className={`py-3 px-4 font-semibold text-sm transition-all ${
                      timeFilter === 'yearly'
                        ? 'bg-secondary text-primary border-b-4 border-primary'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    YEARLY
                  </button>
                </div>

                {/* Table Content */}
                <div className="max-h-[500px] overflow-y-auto">
                  {sortedStats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p>No usage data available</p>
                      {hasActiveFilters && (
                        <Button onClick={handleClearFilters} variant="outline" className="mt-4">
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {sortedStats.map((stat, index) => (
                        <motion.div
                          key={stat.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="grid grid-cols-4 items-center p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-800">{stat.name}</div>
                            {stat.category && (
                              <div className="text-xs text-gray-500 mt-1">{stat.category}</div>
                            )}
                          </div>
                          <div className="text-center">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                              {stat.weekly}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              {stat.monthly}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                              {stat.yearly}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Most Used Section */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-gray-200 shadow-md overflow-hidden h-full">
                <div className="bg-gradient-to-r from-secondary to-secondary/90 p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-primary">Most Used</h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {mostUsed.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No data available</p>
                  ) : (
                    mostUsed.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200 hover:border-secondary/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800 flex-1 truncate">
                            {item.name}
                          </span>
                          <span className="ml-2 px-3 py-1 bg-primary text-secondary rounded-full text-sm font-bold shadow-sm">
                            #{index + 1}
                          </span>
                        </div>
                        {item.category && (
                          <div className="text-xs text-gray-500 mb-2">{item.category}</div>
                        )}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Used:</span>
                            <span className="font-bold text-primary">{item.total}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>This Month:</span>
                            <span className="font-semibold">{item.monthly}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Filter Dialog */}
      <ExportFilterDialog
        isOpen={showExportFilterForm}
        onClose={() => setShowExportFilterForm(false)}
        onExport={(format) => {
          if (format === 'excel') {
            handleExportToExcel();
          } else if (format === 'pdf') {
            handleExportToPDF();
          }
          setShowExportFilterForm(false);
        }}
        reportType={reportType}
        availableCategories={availableCategories}
        availableSubCategories={reportType === 'finished' && exportCategory !== 'all' 
          ? FINISHED_PRODUCT_SUBCATEGORIES[exportCategory as keyof typeof FINISHED_PRODUCT_SUBCATEGORIES] || []
          : []
        }
        exportDatePreset={exportDatePreset}
        setExportDatePreset={setExportDatePreset}
        exportStartDate={exportStartDate}
        setExportStartDate={setExportStartDate}
        exportEndDate={exportEndDate}
        setExportEndDate={setExportEndDate}
        exportCategory={exportCategory}
        setExportCategory={setExportCategory}
        exportSubCategory={exportSubCategory}
        setExportSubCategory={setExportSubCategory}
        totalItems={sortedStats.length}
      />
    </motion.div>
  );
}