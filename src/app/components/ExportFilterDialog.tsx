import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Calendar as CalendarIcon, X, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, startOfDay, endOfDay, subDays, subMonths, subYears } from 'date-fns';

type DatePreset = 'today' | '7days' | '30days' | '3months' | '1year' | 'custom' | 'all';
type ReportType = 'finished' | 'raw' | 'packaging';
type ExportFormat = 'excel' | 'pdf' | null;

interface ExportFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'excel' | 'pdf') => void;
  reportType: ReportType;
  availableCategories: string[];
  availableSubCategories: string[];
  exportDatePreset: DatePreset;
  setExportDatePreset: (preset: DatePreset) => void;
  exportStartDate: string;
  setExportStartDate: (date: string) => void;
  exportEndDate: string;
  setExportEndDate: (date: string) => void;
  exportCategory: string;
  setExportCategory: (category: string) => void;
  exportSubCategory: string;
  setExportSubCategory: (subCategory: string) => void;
  totalItems: number;
}

export function ExportFilterDialog({
  isOpen,
  onClose,
  onExport,
  reportType,
  availableCategories,
  availableSubCategories,
  exportDatePreset,
  setExportDatePreset,
  exportStartDate,
  setExportStartDate,
  exportEndDate,
  setExportEndDate,
  exportCategory,
  setExportCategory,
  exportSubCategory,
  setExportSubCategory,
  totalItems,
}: ExportFilterDialogProps) {
  
  // Handle export date preset changes
  const handleExportDatePresetChange = (preset: DatePreset) => {
    setExportDatePreset(preset);
    const today = new Date();
    
    switch (preset) {
      case 'today':
        setExportStartDate(format(startOfDay(today), 'yyyy-MM-dd'));
        setExportEndDate(format(endOfDay(today), 'yyyy-MM-dd'));
        break;
      case '7days':
        setExportStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
        setExportEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case '30days':
        setExportStartDate(format(subDays(today, 30), 'yyyy-MM-dd'));
        setExportEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case '3months':
        setExportStartDate(format(subMonths(today, 3), 'yyyy-MM-dd'));
        setExportEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case '1year':
        setExportStartDate(format(subYears(today, 1), 'yyyy-MM-dd'));
        setExportEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'all':
        setExportStartDate('');
        setExportEndDate('');
        break;
      case 'custom':
        // Keep current dates
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-white shadow-2xl rounded-xl">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 p-6 rounded-t-xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">Export Data Filters</h3>
                    <p className="text-sm text-secondary/80 mt-1">
                      Select the data range and categories you want to export
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Date Range Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-primary text-lg">Date Range</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time Period
                      </label>
                      <Select value={exportDatePreset} onValueChange={(value: DatePreset) => handleExportDatePresetChange(value)}>
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
                          <SelectItem value="custom">Custom Date Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Date Inputs */}
                    <AnimatePresence>
                      {exportDatePreset === 'custom' && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Date
                            </label>
                            <Input
                              type="date"
                              value={exportStartDate}
                              onChange={(e) => setExportStartDate(e.target.value)}
                              className="border-2 border-gray-200 focus:border-secondary/50"
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Date
                            </label>
                            <Input
                              type="date"
                              value={exportEndDate}
                              onChange={(e) => setExportEndDate(e.target.value)}
                              className="border-2 border-gray-200 focus:border-secondary/50"
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Date Preview */}
                  {exportDatePreset !== 'all' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg"
                    >
                      <p className="text-sm text-blue-800">
                        <strong>Selected Range:</strong>{' '}
                        {exportDatePreset === 'custom' && exportStartDate && exportEndDate
                          ? `${exportStartDate} to ${exportEndDate}`
                          : exportDatePreset === 'today' ? 'Today'
                          : exportDatePreset === '7days' ? 'Last 7 Days'
                          : exportDatePreset === '30days' ? 'Last 30 Days'
                          : exportDatePreset === '3months' ? 'Last 3 Months'
                          : 'Last Year'}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Category Filters Section */}
                {(reportType === 'finished' || reportType === 'raw') && availableCategories.length > 0 && (
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-primary text-lg">Category Filters</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Main Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Category
                        </label>
                        <Select value={exportCategory} onValueChange={(value) => {
                          setExportCategory(value);
                          setExportSubCategory('all'); // Reset sub-category
                        }}>
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

                      {/* Sub-category - Only for Finished Products */}
                      {reportType === 'finished' && exportCategory !== 'all' && availableSubCategories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sub-Category
                          </label>
                          <Select value={exportSubCategory} onValueChange={setExportSubCategory}>
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
                    </div>

                    {/* Category Preview */}
                    {exportCategory !== 'all' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg"
                      >
                        <p className="text-sm text-green-800">
                          <strong>Filter Applied:</strong> {exportCategory}
                          {exportSubCategory !== 'all' && ` > ${exportSubCategory}`}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📊</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-blue-900 mb-2">Export Summary</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>{totalItems} items</strong> will be exported</li>
                        <li>• Usage statistics (Weekly, Monthly, Yearly, Total)</li>
                        <li>• Filtered by your selected criteria</li>
                        <li>• Ready for Excel or PDF format</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-b-xl border-t-2 border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    Select your preferred export format:
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {totalItems} items ready
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="border-2 border-gray-300 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => onExport('excel')}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => onExport('pdf')}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}