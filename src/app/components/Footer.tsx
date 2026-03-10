import { Heart, Shield, Clock, Mail, Phone, MapPin, Home, Package, History, AlertCircle, Database, Lock, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface FooterProps {
  rawMaterialsCount?: number;
  finishedProductsCount?: number;
  activityCount?: number;
}

export function Footer({ rawMaterialsCount = 0, finishedProductsCount = 0, activityCount = 0 }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Check Supabase connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('raw_materials').select('count').limit(1);
        setIsSupabaseConnected(!error);
      } catch (error) {
        setIsSupabaseConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate storage zones (simplified - could be enhanced based on actual data)
  const storageZones = 3;

  return (
    <motion.footer 
      className="border-t-2 border-gray-200 shadow-2xl mt-12"
      style={{ backgroundColor: '#002D62' }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Footer Bottom - Centered */}
        <div className="text-center space-y-3">
          {/* Copyright and Version */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm" style={{ color: '#C7A32F' }}>
            <span>© {currentYear} Mnemosyne: Photo Memory Jewels</span>
            <span className="hidden md:inline" style={{ color: '#C7A32F', opacity: 0.6 }}>•</span>
            <Badge variant="outline" className="text-xs" style={{ borderColor: '#C7A32F', color: '#C7A32F' }}>
              Version 1.0.0
            </Badge>
            <span className="hidden md:inline" style={{ color: '#C7A32F', opacity: 0.6 }}>•</span>
            <span style={{ color: '#C7A32F' }}>All rights reserved</span>
          </div>

          {/* Quote */}
          <p className="text-xs italic leading-relaxed max-w-2xl mx-auto" style={{ color: '#C7A32F', opacity: 0.8 }}>
            "Memory is the treasury and guardian of all things."
          </p>

          {/* Made with Love */}
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#C7A32F' }}>
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" />
            <span>for inventory excellence</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}