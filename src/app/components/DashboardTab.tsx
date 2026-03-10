import { useMemo, useState, useEffect, useRef } from 'react';
import { Package, PackageOpen, AlertTriangle, Activity, PieChart as PieChartIcon, Wifi, WifiOff, Clock, Droplet, Download, FileText, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Thermometer, Box, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RawMaterial, FinishedProduct, ActivityLog, PackagingMaterial } from '../types/inventory';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { ProgressRing } from './ProgressRing';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface DashboardTabProps {
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  activityLog: ActivityLog[];
  packagingMaterials?: PackagingMaterial[];
  onNavigateToMaterial?: (materialId: string) => void;
  onNavigateToPackaging?: (materialId: string) => void;
  onNavigateToFinished?: () => void;
  onNavigateToRaw?: () => void;
  onNavigateToActivity?: () => void;
}

const CHART_COLORS = {
  primary: '#0a2647',
  secondary: '#d4af37',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

const PIE_COLORS = ['#0a2647', '#d4af37', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function DashboardTab({ rawMaterials, finishedProducts, activityLog, packagingMaterials = [], onNavigateToMaterial, onNavigateToPackaging, onNavigateToFinished, onNavigateToRaw, onNavigateToActivity }: DashboardTabProps) {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [gaugePage, setGaugePage] = useState(0);
  const [weather, setWeather] = useState<{
    temp: number;
    feelsLike: number;
    humidity: number;
    windspeed: number;
    weathercode: number;
    city: string;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'idle'>('idle');

  // Refs for chart export
  const inventoryChartRef = useRef<HTMLDivElement>(null);
  const materialGaugesChartRef = useRef<HTMLDivElement>(null);

  // Export chart as PNG
  const exportChartAsPNG = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!ref.current) return;
    
    try {
      toast.info('Generating chart image...');
      
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (element) => {
          // Ignore export buttons during capture
          return element.classList.contains('export-buttons') || 
                 element.closest('.export-buttons') !== null;
        },
        onclone: (clonedDoc, clonedElement) => {
          // Remove all external stylesheets to avoid oklch parsing
          const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
          links.forEach(link => link.remove());
          
          // Remove all style tags
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach(style => style.remove());
          
          // Apply computed styles as inline styles for all elements
          const allElements = clonedDoc.querySelectorAll('*');
          
          allElements.forEach((element) => {
            const el = element as HTMLElement;
            
            try {
              // Get the original element from the live DOM
              const originalElement = el;
              const computedStyle = window.getComputedStyle(originalElement);
              
              // Set critical styles inline using getPropertyValue
              const styles = [
                'background-color',
                'color',
                'border-color',
                'border-top-color',
                'border-right-color',
                'border-bottom-color',
                'border-left-color',
                'font-size',
                'font-weight',
                'font-family',
                'padding',
                'margin',
                'width',
                'height',
                'display',
                'position',
                'top',
                'left',
                'right',
                'bottom'
              ];
              
              styles.forEach(prop => {
                const value = computedStyle.getPropertyValue(prop);
                if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent' && value !== 'none') {
                  el.style.setProperty(prop, value);
                }
              });
              
            } catch (e) {
              console.warn('Could not apply styles to element:', e);
            }
          });
        }
      });
      
      const link = document.createElement('a');
      link.download = `mnemosyne-${filename}-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success(`Chart exported successfully!`);
    } catch (error) {
      toast.error('Failed to export chart. Please try again.');
      console.error('Export error:', error);
    }
  };

  // Export data as CSV
  const exportDataAsCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).map(val => {
        // Handle null/undefined values and escape commas
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') ? `"${str}"` : str;
      }).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.download = `mnemosyne-${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.href = URL.createObjectURL(blob);
      link.click();
      
      toast.success(`Data exported successfully!`);
    } catch (error) {
      toast.error('Failed to export data. Please try again.');
      console.error('CSV export error:', error);
    }
  };

  // Check Supabase connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('raw_materials').select('count').limit(1);
        setIsSupabaseConnected(!error);
        setLastSyncTime('Just now');
      } catch (error) {
        setIsSupabaseConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch weather using Open-Meteo (free, no API key needed)
  useEffect(() => {
    const fetchWeatherData = async (lat: number, lon: number, cityName: string) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,windspeed_10m,weathercode&timezone=auto`
        );
        const data = await res.json();
        const c = data.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windspeed: Math.round(c.windspeed_10m),
          weathercode: c.weathercode,
          city: cityName,
        });
      } catch {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    const fetchWeather = () => {
      setWeatherLoading(true);
      if (!navigator.geolocation) {
        // Geolocation not supported – fall back to Manila
        fetchWeatherData(14.5995, 120.9842, 'Manila, PH');
        return;
      }
      setLocationStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocationStatus('granted');
          const { latitude, longitude } = position.coords;
          // Reverse-geocode with Nominatim (free, no key)
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const geoData = await geoRes.json();
            const city =
              geoData.address?.city ||
              geoData.address?.town ||
              geoData.address?.village ||
              geoData.address?.county ||
              'Your Location';
            const country = geoData.address?.country_code?.toUpperCase() || '';
            const cityLabel = country ? `${city}, ${country}` : city;
            fetchWeatherData(latitude, longitude, cityLabel);
          } catch {
            // Reverse geocode failed – still show weather without city name
            fetchWeatherData(latitude, longitude, 'Your Location');
          }
        },
        () => {
          // Permission denied – fall back to Manila
          setLocationStatus('denied');
          fetchWeatherData(14.5995, 120.9842, 'Manila, PH*');
        },
        { timeout: 8000 }
      );
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  // Calculate key metrics
  const totalProducts = finishedProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalMaterials = rawMaterials.reduce((sum, m) => sum + m.stock, 0);
  const outOfStockMaterials = rawMaterials.filter(m => m.stock === 0);
  const lowStockMaterials = rawMaterials.filter(m => {
    const threshold = m.monthlyThreshold || 20;
    return m.stock > 0 && m.stock < threshold;
  });
  const outOfStockPackaging = packagingMaterials.filter(m => m.stock === 0);
  const lowStockPackaging = packagingMaterials.filter(m => {
    const threshold = m.monthlyThreshold || 20;
    return m.stock > 0 && m.stock < threshold;
  });
  const totalActivities = activityLog.length;

  // Calculate material capacity percentage (assuming max capacity of 1000 units total)
  const MAX_MATERIAL_CAPACITY = 1000;
  const materialCapacityPercentage = Math.min((totalMaterials / MAX_MATERIAL_CAPACITY) * 100, 100);

  // Calculate product capacity percentage (assuming max capacity of 500 units total)
  const MAX_PRODUCT_CAPACITY = 500;
  const productCapacityPercentage = Math.min((totalProducts / MAX_PRODUCT_CAPACITY) * 100, 100);

  // Stock levels comparison (Products vs Materials) - Donut Chart
  const stockComparison = useMemo(() => {
    return [
      { name: 'Finished Products', value: totalProducts, fill: CHART_COLORS.primary },
      { name: 'Raw Materials', value: totalMaterials, fill: CHART_COLORS.secondary },
    ];
  }, [totalProducts, totalMaterials]);

  // Material stock levels for liquid gauges
  const materialStockData = useMemo(() => {
    return rawMaterials.map(m => {
      const threshold = m.monthlyThreshold || 20;
      const maxStock = threshold > 0 ? threshold * 2 : 100;
      return {
        name: m.name,
        stock: m.stock,
        threshold: threshold,
        percentage: Math.min((m.stock / maxStock) * 100, 100),
        status: m.stock === 0 ? 'Out' : m.stock < threshold ? 'Low' : 'Good',
      };
    });
  }, [rawMaterials]);

  const GAUGES_PER_PAGE = 10; // 5 cols × 2 rows
  const totalGaugePages = Math.ceil(materialStockData.length / GAUGES_PER_PAGE);
  const pagedGaugeData = materialStockData.slice(
    gaugePage * GAUGES_PER_PAGE,
    gaugePage * GAUGES_PER_PAGE + GAUGES_PER_PAGE
  );

  // Custom Donut Label Component
  const renderCenterLabel = () => {
    const totalStock = totalProducts + totalMaterials;
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-10" fontSize="24" fontWeight="bold" fill={CHART_COLORS.primary}>
          {totalStock}
        </tspan>
        <tspan x="50%" dy="24" fontSize="14" fill="#6b7280">
          Total Stock
        </tspan>
      </text>
    );
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-2 border-secondary/20">
      <div className="space-y-6">
        {/* Dark Navy System Health Bar */}
        <motion.div
          className="bg-primary text-white px-6 py-4 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              {/* Supabase Connection Status */}
              <div className="flex items-center gap-2">
                {isSupabaseConnected ? (
                  <>
                    <div className="relative">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm font-semibold">
                      Supabase: <span className="text-green-400">Active</span>
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold">
                      Supabase: <span className="text-red-400">Disconnected</span>
                    </span>
                  </>
                )}
              </div>

              {/* Last Sync Time */}
              <div className="flex items-center gap-2 border-l border-white/30 pl-6">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-sm">
                  Last Sync: <span className="font-semibold text-secondary">{lastSyncTime}</span>
                </span>
              </div>
            </div>

            {/* System Status Badge */}
            <Badge 
              variant={isSupabaseConnected ? "secondary" : "destructive"}
              className="font-semibold px-4 py-1"
            >
              {isSupabaseConnected ? "System Operational" : "System Alert"}
            </Badge>
          </div>
        </motion.div>

        {/* Key Metrics Cards with Progress Rings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products with Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => onNavigateToFinished?.()}
            className="cursor-pointer"
          >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <ProgressRing 
                    percentage={productCapacityPercentage} 
                    color={CHART_COLORS.primary}
                    size={100}
                    strokeWidth={10}
                  >
                    <div className="text-center">
                      <Package className="w-8 h-8 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-primary">{totalProducts}</p>
                    </div>
                  </ProgressRing>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Finished Products</p>
                    <p className="text-xs text-gray-500 mt-1">{finishedProducts.length} types • {productCapacityPercentage.toFixed(0)}% capacity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Materials with Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => onNavigateToRaw?.()}
            className="cursor-pointer"
          >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <ProgressRing 
                    percentage={materialCapacityPercentage} 
                    color={CHART_COLORS.secondary}
                    size={100}
                    strokeWidth={10}
                  >
                    <div className="text-center">
                      <PackageOpen className="w-8 h-8 text-secondary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-secondary">{totalMaterials}</p>
                    </div>
                  </ProgressRing>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Raw Materials</p>
                    <p className="text-xs text-gray-500 mt-1">{rawMaterials.length} types • {materialCapacityPercentage.toFixed(0)}% capacity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Activities with Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            onClick={() => onNavigateToActivity?.()}
            className="cursor-pointer"
          >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <ProgressRing 
                    percentage={Math.min((totalActivities / 100) * 100, 100)} 
                    color={CHART_COLORS.info}
                    size={100}
                    strokeWidth={10}
                  >
                    <div className="text-center">
                      <Activity className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-blue-600">{totalActivities}</p>
                    </div>
                  </ProgressRing>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Total Activities</p>
                    <p className="text-xs text-gray-500 mt-1">all-time transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weather Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white">
              <CardContent className="pt-6">
                {weatherLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-[100px] h-[100px] rounded-full bg-gray-100 animate-pulse flex items-center justify-center">
                      <Thermometer className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-400">
                        {locationStatus === 'requesting' ? 'Detecting location...' : 'Loading weather...'}
                      </p>
                    </div>
                  </div>
                ) : weather ? (
                  <div className="flex flex-col items-center gap-3">
                    {/* Weather Icon Circle */}
                    <div
                      className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center shadow-lg"
                      style={{
                        background: weather.weathercode <= 1
                          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                          : weather.weathercode <= 3
                          ? 'linear-gradient(135deg, #93c5fd, #3b82f6)'
                          : weather.weathercode < 60
                          ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                          : 'linear-gradient(135deg, #60a5fa, #2563eb)',
                      }}
                    >
                      {weather.weathercode <= 1 ? (
                        <Sun className="w-8 h-8 text-white mb-0.5" />
                      ) : weather.weathercode <= 3 ? (
                        <Cloud className="w-8 h-8 text-white mb-0.5" />
                      ) : weather.weathercode < 60 ? (
                        <Wind className="w-8 h-8 text-white mb-0.5" />
                      ) : weather.weathercode < 70 ? (
                        <CloudRain className="w-8 h-8 text-white mb-0.5" />
                      ) : weather.weathercode < 80 ? (
                        <CloudSnow className="w-8 h-8 text-white mb-0.5" />
                      ) : (
                        <CloudLightning className="w-8 h-8 text-white mb-0.5" />
                      )}
                      <p className="text-2xl font-bold text-white leading-none">{weather.temp}°C</p>
                    </div>

                    {/* Weather Details */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MapPin className={`w-3 h-3 flex-shrink-0 ${locationStatus === 'granted' ? 'text-green-500' : 'text-gray-400'}`} />
                        <p className="text-sm font-semibold text-gray-700 truncate max-w-[110px]">{weather.city.replace('*', '')}</p>
                      </div>
                      {locationStatus === 'denied' && (
                        <p className="text-[9px] text-orange-400 mt-0.5">Location denied · default city</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        Feels {weather.feelsLike}°C · 💧{weather.humidity}%
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Wind {weather.windspeed} km/h
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-[100px] h-[100px] rounded-full bg-gray-100 flex items-center justify-center">
                      <Thermometer className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Weather</p>
                      <p className="text-xs text-gray-400 mt-1">Unavailable</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modern Donut Chart with Legend */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-secondary to-secondary/90 text-white border-0">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-3 rounded-xl shadow-lg">
                    <PieChartIcon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-white font-bold" style={{ fontFamily: 'Inter' }}>Inventory Distribution</CardTitle>
                    <p className="text-sm text-white/80 mt-1">Products vs Materials breakdown</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6" ref={inventoryChartRef}>
                <div className="flex items-center justify-between gap-6">
                  {/* Donut Chart */}
                  <div className="flex-shrink-0">
                    <PieChart width={240} height={240}>
                      <Pie
                        data={stockComparison}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={5}
                      >
                        {stockComparison.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={3} />
                        ))}
                      </Pie>
                      {renderCenterLabel()}
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #d4af37',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </div>

                  {/* Vertical Legend on Right */}
                  <div className="flex flex-col gap-4 flex-1">
                    {stockComparison.map((entry, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded-md shadow-md" 
                          style={{ backgroundColor: entry.fill }}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700">{entry.name}</p>
                          <p className="text-xs text-gray-500">{entry.value} units</p>
                          <div className="mt-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${(entry.value / (totalProducts + totalMaterials)) * 100}%`,
                                backgroundColor: entry.fill 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Export Buttons */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-200 export-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportDataAsCSV(stockComparison, 'inventory-distribution-data')}
                    className="flex items-center gap-2 border-secondary/20 hover:bg-secondary/5 hover:border-secondary/40 text-secondary transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Data (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Material Level Gauges - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-white h-full">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-3 rounded-xl shadow-lg">
                    <Droplet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-white font-bold" style={{ fontFamily: 'Inter' }}>Material Level Gauges</CardTitle>
                    <p className="text-sm text-white/80 mt-1">Live stock status by material</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4" ref={materialGaugesChartRef}>
                {materialStockData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-5 gap-x-3 gap-y-4">
                      {pagedGaugeData.map((material, index) => {
                        const getGaugeColor = (stock: number, threshold: number) => {
                          if (stock === 0) return CHART_COLORS.danger;
                          if (stock < threshold) return '#f97316';
                          return CHART_COLORS.success;
                        };

                        return (
                          <div key={index} className="flex flex-col items-center gap-1">
                            {/* Compact Vertical Liquid Gauge */}
                            <div className="relative w-8 h-20 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 rounded-full"
                                initial={{ height: 0 }}
                                animate={{ height: `${material.percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.06 }}
                                style={{
                                  background: `linear-gradient(to top, ${getGaugeColor(material.stock, material.threshold)}, ${getGaugeColor(material.stock, material.threshold)}dd)`,
                                  boxShadow: `0 -4px 10px ${getGaugeColor(material.stock, material.threshold)}44 inset`,
                                }}
                              >
                                {/* Animated Wave Effect */}
                                <div 
                                  className="absolute top-0 left-0 right-0 h-3 opacity-40"
                                  style={{
                                    background: `repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.3) 6px, rgba(255,255,255,0.3) 12px)`,
                                    animation: 'wave 3s linear infinite',
                                  }}
                                ></div>
                              </motion.div>
                              
                              {/* Stock Value Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white drop-shadow-lg">
                                  {material.stock}
                                </span>
                              </div>
                            </div>
                            
                            {/* Material Name */}
                            <p className="text-[9px] text-center font-semibold text-gray-700 truncate w-full leading-tight">
                              {material.name}
                            </p>
                            <Badge 
                              variant={material.stock === 0 ? 'destructive' : 'secondary'}
                              className={`text-[8px] px-1 py-0 h-3.5 ${
                                material.stock === 0 
                                  ? 'bg-red-500 text-white' 
                                  : material.stock < material.threshold 
                                  ? 'bg-orange-500 text-white' 
                                  : 'bg-green-500 text-white'
                              }`}
                            >
                              {material.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {totalGaugePages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setGaugePage(p => Math.max(0, p - 1))}
                          disabled={gaugePage === 0}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          ← Prev
                        </button>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Page {gaugePage + 1} / {totalGaugePages}
                          <span className="ml-1 text-gray-400">({materialStockData.length} materials)</span>
                        </span>
                        <button
                          onClick={() => setGaugePage(p => Math.min(totalGaugePages - 1, p + 1))}
                          disabled={gaugePage >= totalGaugePages - 1}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-primary/20 text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-gray-400">
                    <p>No material data available</p>
                  </div>
                )}
                
                <style>{`
                  @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-20px); }
                  }
                `}</style>
                
                {/* Export Buttons */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-gray-200 export-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportDataAsCSV(materialStockData, 'material-gauges-data')}
                    className="flex items-center gap-2 border-secondary/20 hover:bg-secondary/5 hover:border-secondary/40 text-secondary transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Data (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Low Stock Alert Section */}
        {(outOfStockMaterials.length > 0 || lowStockMaterials.length > 0 || outOfStockPackaging.length > 0 || lowStockPackaging.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-orange-500 text-white border-0 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl shadow-lg">
                      <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <CardTitle className="text-white font-bold" style={{ fontFamily: 'Inter' }}>
                        Low Stock Alerts
                      </CardTitle>
                      <p className="text-sm text-white/80 mt-0.5">
                        {outOfStockMaterials.length + outOfStockPackaging.length} out of stock · {lowStockMaterials.length + lowStockPackaging.length} below threshold
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 font-semibold px-3 py-1">
                    {outOfStockMaterials.length + lowStockMaterials.length + outOfStockPackaging.length + lowStockPackaging.length} items need attention
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-5 space-y-5">

                {/* Raw Materials Sub-section */}
                {(outOfStockMaterials.length > 0 || lowStockMaterials.length > 0) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-primary rounded-full" />
                      <PackageOpen className="w-4 h-4 text-primary" />
                      <p className="text-sm font-bold text-primary tracking-wide uppercase">Raw Materials</p>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 ml-1">
                        {outOfStockMaterials.length + lowStockMaterials.length} items
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {outOfStockMaterials.map((material) => {
                        const threshold = material.monthlyThreshold || 20;
                        return (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => onNavigateToMaterial?.(material.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate group-hover:text-red-700 transition-colors">{material.name}</p>
                              <p className="text-xs text-gray-500 truncate">{material.category || 'Raw Material'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-red-500 rounded-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-[10px] font-semibold text-red-600 whitespace-nowrap">0 / {threshold}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5">Out</Badge>
                              <span className="text-[9px] text-red-400 font-medium group-hover:text-red-600 transition-colors">View →</span>
                            </div>
                          </motion.div>
                        );
                      })}
                      {lowStockMaterials.map((material) => {
                        const threshold = material.monthlyThreshold || 20;
                        const pct = Math.min((material.stock / threshold) * 100, 100);
                        return (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => onNavigateToMaterial?.(material.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-700 transition-colors">{material.name}</p>
                              <p className="text-xs text-gray-500 truncate">{material.category || 'Raw Material'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[10px] font-semibold text-orange-600 whitespace-nowrap">{material.stock} / {threshold}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge className="bg-orange-400 text-white text-[10px] px-2 py-0.5">Low</Badge>
                              <span className="text-[9px] text-orange-400 font-medium group-hover:text-orange-600 transition-colors">View →</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Divider between sections */}
                {(outOfStockMaterials.length > 0 || lowStockMaterials.length > 0) &&
                  (outOfStockPackaging.length > 0 || lowStockPackaging.length > 0) && (
                  <div className="border-t border-dashed border-gray-200" />
                )}

                {/* Packaging Materials Sub-section */}
                {(outOfStockPackaging.length > 0 || lowStockPackaging.length > 0) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-secondary rounded-full" />
                      <Box className="w-4 h-4 text-secondary" />
                      <p className="text-sm font-bold text-secondary tracking-wide uppercase">Packaging Materials</p>
                      <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[10px] px-2 py-0.5 ml-1">
                        {outOfStockPackaging.length + lowStockPackaging.length} items
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {outOfStockPackaging.map((material) => {
                        const threshold = material.monthlyThreshold || 20;
                        return (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => onNavigateToPackaging?.(material.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Box className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate group-hover:text-red-700 transition-colors">{material.name}</p>
                              <p className="text-xs text-gray-400 truncate">Packaging</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-red-500 rounded-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-[10px] font-semibold text-red-600 whitespace-nowrap">0 / {threshold}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5">Out</Badge>
                              <span className="text-[9px] text-red-400 font-medium group-hover:text-red-600 transition-colors">View →</span>
                            </div>
                          </motion.div>
                        );
                      })}
                      {lowStockPackaging.map((material) => {
                        const threshold = material.monthlyThreshold || 20;
                        const pct = Math.min((material.stock / threshold) * 100, 100);
                        return (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => onNavigateToPackaging?.(material.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Box className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-700 transition-colors">{material.name}</p>
                              <p className="text-xs text-gray-400 truncate">Packaging</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[10px] font-semibold text-orange-600 whitespace-nowrap">{material.stock} / {threshold}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge className="bg-orange-400 text-white text-[10px] px-2 py-0.5">Low</Badge>
                              <span className="text-[9px] text-orange-400 font-medium group-hover:text-orange-600 transition-colors">View →</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </Card>
  );
}