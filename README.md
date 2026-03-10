# 💎 Mnemosyne Inventory Management System

<div align="center">

![Mnemosyne Logo](https://img.shields.io/badge/Mnemosyne-Photo_Memory_Jewels-d4af37?style=for-the-badge&logo=gem&logoColor=white)

**Enterprise-grade inventory tracking for finished products, raw materials, and packaging**

[![Status](https://img.shields.io/badge/Status-Fully_Operational-success?style=flat-square)](.)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Framework](https://img.shields.io/badge/Framework-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)]()

</div>

---

## 🚀 Quick Start

### Your App is Already Working! ✅

Your Mnemosyne system is **fully functional right now** using localStorage:
- ✅ Add, edit, delete inventory items
- ✅ Track stock levels
- ✅ Generate reports
- ✅ View activity logs
- ✅ Upload images
- ✅ Works offline

### Want Cross-Device Sync? (Optional - 2 Minutes)

Follow the [Quick Start Guide](/QUICK_START.txt) to enable cloud synchronization.

---

## 📋 System Overview

### **Key Features**

🎯 **Bill of Materials Tracking**
- Automatic raw material deduction when finished products are used
- Real-time stock level monitoring
- Low stock alerts and warnings

📦 **Complete Inventory Management**
- **Finished Products** - Track completed items ready for sale
- **Raw Materials** - Monitor component stock levels
- **Packaging Materials** - Manage boxes, wrapping, and containers

📊 **Advanced Analytics**
- Interactive dashboard with real-time graphs
- Activity logs with date filtering
- Export reports to Excel
- Material usage tracking

🖼️ **Image Management**
- Upload product and material images
- Base64 storage in database
- Automatic image optimization

🌐 **Dual Storage System**
- **localStorage** - Instant saves, offline access
- **Supabase** - Cloud backup, cross-device sync
- **Smart Fallback** - Works even when server is offline

---

## 🔧 Database Setup

### Current Status

**Project ID:** `jqbmnoxxgocjadllsipn`  
**Project URL:** `https://jqbmnoxxgocjadllsipn.supabase.co`  
**Anon Key:** ✅ Configured

### Setup Instructions

1. **Open SQL Editor:**  
   👉 [https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor](https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor)

2. **Run Setup Script:**  
   Copy content from `/supabase/init.sql` and run it

3. **Verify Setup:**  
   Use the built-in **"Test Database Connection"** button in Account Settings

For detailed instructions, see:
- 📖 [Complete Setup Guide](/COMPLETE_SETUP_GUIDE.md)
- 🚀 [Quick Start](/QUICK_START.txt)
- 💾 [Database Setup](/DATABASE_SETUP.md)

---

## 🎨 Brand Identity

**Colors:**
- Primary: Navy Blue (`#0a2647`)
- Secondary: Gold (`#d4af37`)

**Typography:**
- Headings: Semibold, wide letter-spacing
- Body: Clean, professional

**Logo:**
- Custom Mnemosyne brand mark
- Integrated throughout the interface

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Recharts** - Data visualization

### Backend & Database
- **Supabase** - Cloud database & authentication
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Data protection

### Storage
- **localStorage** - Client-side persistence
- **Supabase Storage** - Cloud backup
- **Dual-write System** - Maximum reliability

---

## 📂 Project Structure

```
mnemosyne/
├── src/
│   ├── app/
│   │   ├── components/           # React components
│   │   │   ├── DashboardTab.tsx
│   │   │   ├── FinishedProductsTab.tsx
│   │   │   ├── RawMaterialsTab.tsx
│   │   │   ├── PackagingMaterialsTab.tsx
│   │   │   ├── ReportsTab.tsx
│   │   │   ├── ActivityLogTab.tsx
│   │   │   └── ui/               # Reusable UI components
│   │   ├── lib/
│   │   │   └── supabase.ts       # Supabase client
│   │   ├── services/
│   │   │   └── api.ts            # API service layer
│   │   ├── types/
│   │   │   └── inventory.ts     # TypeScript types
│   │   ├── utils/
│   │   │   └── testDatabase.ts  # Database diagnostics
│   │   └── App.tsx               # Main app component
│   └── styles/                   # Global styles
├── supabase/
│   ├── init.sql                  # Database setup script
│   └── functions/                # Edge functions
├── COMPLETE_SETUP_GUIDE.md       # Detailed setup instructions
├── DATABASE_SETUP.md             # Database configuration
├── QUICK_START.txt               # Quick reference
└── README.md                     # This file
```

---

## 🧪 Testing Your Setup

### Built-in Diagnostic Tool

1. Click **"Account Settings"** in the top right
2. Click **"Test Database Connection"**
3. Open browser console (F12)
4. Review diagnostic results

### Manual Testing

1. Go to **Packaging Materials** tab
2. Add a test material
3. Check console for success message:
   ```
   ✅✅✅ Successfully saved to Supabase database!
   🎉 Material is now synced across all devices!
   ```

---

## 📊 Database Schema

### Tables

#### `packaging_materials`
- `id` (TEXT, Primary Key)
- `name` (TEXT, NOT NULL)
- `stock` (NUMERIC, NOT NULL)
- `unit` (TEXT, NOT NULL)
- `image_url` (TEXT)
- `reorder_link` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `raw_materials`
- `id` (TEXT, Primary Key)
- `name` (TEXT, NOT NULL)
- `stock` (NUMERIC, NOT NULL)
- `unit` (TEXT, NOT NULL)
- `image_url` (TEXT)
- `category` (TEXT)
- `reorder_link` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `finished_products`
- `id` (TEXT, Primary Key)
- `name` (TEXT, NOT NULL)
- `stock` (NUMERIC, NOT NULL)
- `bill_of_materials` (JSONB, NOT NULL)
- `image_url` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `activity_logs`
- `id` (TEXT, Primary Key)
- `timestamp` (TIMESTAMPTZ, NOT NULL)
- `action` (TEXT, NOT NULL)
- `quantity` (NUMERIC)
- `product_name` (TEXT)
- `material_name` (TEXT)
- `packaging_name` (TEXT)
- `affected_materials` (JSONB)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ)

---

## 🔐 Security

### Row Level Security (RLS)
All tables have RLS enabled with "Allow all" policies for demo purposes.

**For production**, update policies to restrict access:
```sql
CREATE POLICY "Authenticated users only" 
  ON table_name 
  FOR ALL 
  USING (auth.role() = 'authenticated');
```

### Environment Variables
No sensitive keys are exposed in the frontend. All database operations use the public anon key with RLS protection.

---

## 🎯 Usage Guide

### Adding Inventory Items

1. Navigate to the appropriate tab (Finished Products, Raw Materials, or Packaging)
2. Click **"Add [Item Type]"** button
3. Fill in the details:
   - Name
   - Initial stock quantity
   - Unit of measurement
   - (Optional) Upload image
   - (Optional) Reorder link
4. Click **"Add"**
5. Item appears immediately in the list

### Tracking Stock Levels

- **Green indicators:** Stock is healthy
- **Yellow indicators:** Stock is getting low
- **Red indicators:** Stock is critically low

### Generating Reports

1. Go to **Reports** tab
2. Select date range (optional)
3. Filter by action type (optional)
4. Click **"Export to Excel"** for downloadable report

### Viewing Activity Logs

1. Go to **Activity Log** tab
2. Use tabs to filter by category:
   - All Activities
   - Products
   - Materials
   - Packaging
3. Use date picker to filter by time range

---

## 🚀 Deployment

### Current Deployment
Your app is deployed and accessible via Figma Make.

### Supabase Project
- **Project:** https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn
- **Region:** Auto-selected by Supabase
- **Status:** Active

---

## 🆘 Troubleshooting

### Database Connection Issues

**Problem:** "Table does not exist" error  
**Solution:** Run `/supabase/init.sql` in Supabase SQL Editor

**Problem:** "Permission denied" error  
**Solution:** Check RLS policies are properly configured

**Problem:** Data not syncing  
**Solution:** 
1. Check internet connection
2. Run database diagnostic tool
3. Verify Supabase project is active

### General Issues

For detailed troubleshooting, see:
- [Complete Setup Guide](/COMPLETE_SETUP_GUIDE.md) - Section "Troubleshooting"
- [Database Setup](/DATABASE_SETUP.md) - Section "Troubleshooting"

---

## 📞 Support Resources

### Documentation
- 📖 [Complete Setup Guide](/COMPLETE_SETUP_GUIDE.md)
- 💾 [Database Setup](/DATABASE_SETUP.md)
- 🚀 [Quick Start](/QUICK_START.txt)
- 📋 [Supabase Documentation](https://supabase.com/docs)

### Useful Links
- [Supabase Dashboard](https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn)
- [SQL Editor](https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor)
- [Table Editor](https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/editor)
- [API Settings](https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/settings/api)

---

## 🎉 Success Criteria

Your system is fully configured when:

- ✅ SQL script runs successfully in Supabase
- ✅ All 4 tables appear in Table Editor
- ✅ Database diagnostic passes all tests
- ✅ Adding materials shows success message in console
- ✅ Data appears in Supabase Table Editor
- ✅ Data syncs across multiple devices

---

## 💡 Pro Tips

1. **Always check the console (F12)** - Detailed logs show exactly what's happening
2. **Use the diagnostic tool** - Built into Account Settings for quick testing
3. **Keep localStorage enabled** - Dual storage ensures maximum reliability
4. **Regular backups** - Export reports periodically for extra safety
5. **Monitor stock levels** - Dashboard provides at-a-glance status

---

## 📝 License

This project is private and proprietary to Mnemosyne Photo Memory Jewels.

---

<div align="center">

**Built with ❤️ for Mnemosyne**

💎 *Photo Memory Jewels* ✨

</div>
