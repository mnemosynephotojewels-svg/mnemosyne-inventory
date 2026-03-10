# 🚀 QUICK START GUIDE - MNEMOSYNE

## ✅ Connection Status: COMPLETE!

Your Mnemosyne system is **FULLY CONNECTED** to Supabase! 

**Database URL:** `https://johzjtbxgtafpwaenkio.supabase.co` ✅  
**API Key:** Configured ✅  
**Tables:** Ready (4 tables) ✅

---

## 🎯 3-Step Quick Start

### **STEP 1: Load Sample Data** (5 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/johzjtbxgtafpwaenkio

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"+ New query"**

3. **Copy & Run the SQL**
   - Open file: **`SAMPLE_DATA.sql`** (in this project)
   - Copy **ALL** content (Ctrl/Cmd + A, then Ctrl/Cmd + C)
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or Ctrl/Cmd + Enter)
   - ⏳ Wait 5-10 seconds...
   - ✅ You should see: "Success. No rows returned"

4. **Verify Data Loaded**
   - At bottom of SQL Editor, you'll see record counts:
   ```
   table_name              | record_count
   Activity Logs           | 20+
   Finished Products       | 23
   Packaging Materials     | 28
   Raw Materials           | 35+
   ```

---

### **STEP 2: Start Your App** (1 minute)

1. **In your terminal/command prompt:**
   ```bash
   npm run dev
   ```
   (Or if already running, just refresh the browser)

2. **Open in browser:**
   - Usually: http://localhost:5173

---

### **STEP 3: Login & Test** (2 minutes)

1. **Login Page will appear**
   - **Username:** `mnemosyne`
   - **Password:** `mnemosyne000`
   - Click **"Sign In"**

2. **You should see the Dashboard with:**
   - Total stock counts
   - Low stock alerts
   - Aesthetic graphs
   - All tabs: Dashboard, Finished Products, Raw Materials, Packaging, Reports, Activity Log

---

## 🎉 What You'll See

### **Dashboard Tab**
- ✅ **Total Inventory Cards**
  - Finished Products count
  - Raw Materials count
  - Packaging Materials count
  - Activity entries count

- ✅ **Low Stock Alerts**
  - Red/Yellow/Green status cards
  - Click cards to jump to specific materials
  - Real-time threshold monitoring

- ✅ **Beautiful Charts**
  - Stock distribution pie charts
  - Category breakdowns
  - Monthly threshold analysis

---

### **Raw Materials Tab** (35+ Items!)
You'll see materials like:
- **Textiles:** Cotton Fabric (White/Black), Denim, Silk, Linen
- **Sewing:** Polyester Thread, Zippers, Elastic Bands
- **Hardware:** Metal Buttons, Rivets, Snap Fasteners
- **Labels:** Brand Labels, Care Labels, Size Tags
- **Trims:** Lace, Ribbon, Velcro, Shoulder Pads

**Features to test:**
- 🔍 Search materials
- 🏷️ Filter by category
- ➕ Add new material
- ✏️ Edit existing material
- 🗑️ Delete material
- 🎨 Upload images
- 📊 View monthly thresholds (Red/Yellow/Green)
- 📝 View descriptions

---

### **Packaging Materials Tab** (28 Items!)
You'll see:
- **Boxes:** Small, Medium, Large, Extra Large, Gift Boxes
- **Bags:** Poly Mailers, Shopping Bags, Pouches, Zip Lock
- **Protection:** Bubble Wrap, Air Pillows, Foam Sheets
- **Tape:** Packing Tape, Double-Sided, Masking Tape
- **Labels:** Shipping Labels, Barcode Labels, Packing Slips

---

### **Finished Products Tab** (23 Products!)
You'll see:
- **T-Shirts:** Classic White/Black, V-Neck, Polo, Graphic
- **Jeans:** Denim Blue/Black
- **Outerwear:** Hoodies, Jackets, Windbreakers
- **Dresses & Skirts:** Summer Dress, Maxi Dress, Midi Skirt
- **Accessories:** Baseball Caps, Beanies, Tote Bags, Belts, Socks

**🔥 KEY FEATURE - Bill of Materials (BOM):**

Some products have **complete BOMs** already configured:
1. **Classic White T-Shirt**
2. **Classic Black T-Shirt**
3. **Denim Jeans - Blue**
4. **Hoodie - Gray**

**Test the BOM system:**
1. Find "Classic White T-Shirt"
2. Click **"Use Product"** button
3. Enter quantity: **2**
4. Click **"Submit"**
5. Go to **Raw Materials Tab**
6. Check **"Cotton Fabric - White"** → Stock decreased by 5 meters! (2.5m × 2)
7. Check **"Polyester Thread - White"** → Stock decreased by 2 spools!
8. Go to **Activity Log** → See automatic deduction entries!

---

### **Reports Tab**
- 📊 Stock Distribution Charts
- 📈 Category Analysis
- 🎯 Monthly Threshold Reports
- 💾 Export to Excel

---

### **Activity Log Tab** (20+ Entries!)
You'll see recent activity from the last 30 days:
- Material additions
- Product updates
- Stock changes
- All with timestamps and descriptions

**Features:**
- 📅 Filter by date range
- 🔍 Filter by action type
- 🔎 Search activities
- 💾 Export to Excel

---

## 🧪 Full Feature Test Checklist

### ✅ **Test Authentication**
- [ ] Login with mnemosyne/mnemosyne000
- [ ] Click "Forgot Password?" → Test password reset flow
- [ ] Open **Account Settings** (button in header)
- [ ] Change your username/password
- [ ] Logout and login with new credentials

### ✅ **Test Raw Materials**
- [ ] View all 35+ materials
- [ ] Filter by category (Textiles, Hardware, Labels, etc.)
- [ ] Search for "Cotton"
- [ ] Add a new material
- [ ] Edit an existing material
- [ ] Upload an image to a material
- [ ] Delete a material
- [ ] Check monthly threshold colors (Red/Yellow/Green)

### ✅ **Test Packaging Materials**
- [ ] View all 28 packaging items
- [ ] Add new packaging
- [ ] Edit packaging stock
- [ ] Delete packaging item

### ✅ **Test Finished Products**
- [ ] View all 23 products
- [ ] Filter by category
- [ ] Filter by gender
- [ ] Add new product
- [ ] Edit product details
- [ ] Upload product image
- [ ] **Create a BOM** for a new product
- [ ] **Use a product** with BOM → Watch raw materials auto-deduct!
- [ ] Delete a product

### ✅ **Test Bill of Materials (BOM)**
- [ ] Find "Classic White T-Shirt"
- [ ] Click "View/Edit BOM"
- [ ] See all linked materials
- [ ] Use the product (qty: 2)
- [ ] Go to Raw Materials tab
- [ ] Verify "Cotton Fabric - White" decreased by 5 meters
- [ ] Verify "Polyester Thread - White" decreased by 2 spools
- [ ] Check Activity Log for deduction entries

### ✅ **Test Dashboard**
- [ ] View total inventory cards
- [ ] See low stock alerts
- [ ] Click on a low stock alert card
- [ ] Verify it navigates to Raw Materials tab
- [ ] Verify the material is highlighted
- [ ] View stock distribution charts

### ✅ **Test Reports**
- [ ] View comprehensive reports
- [ ] Check stock distribution pie chart
- [ ] Check category breakdown
- [ ] Export report to Excel
- [ ] Open Excel file and verify data

### ✅ **Test Activity Log**
- [ ] View all activities (20+ entries)
- [ ] Filter by date range (last 7 days)
- [ ] Filter by action type (MATERIAL_ADDED)
- [ ] Search for "Cotton"
- [ ] Export to Excel
- [ ] Verify exported data

### ✅ **Test Responsive Design**
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl/Cmd + Shift + M)
- [ ] Test on iPhone size (375px)
- [ ] Test on iPad size (768px)
- [ ] Test on Desktop (1920px)
- [ ] Verify all features work on mobile

### ✅ **Test Motion Animations**
- [ ] Watch tab transitions (smooth Motion animations)
- [ ] Watch cards fade in on Dashboard
- [ ] Watch form dialogs slide in
- [ ] Watch list items animate when added/removed

---

## 🔥 Advanced Features to Explore

### **1. Monthly Threshold System**

The system tracks stock levels against monthly usage thresholds:

- **GREEN** (✅): Stock **>** Monthly Threshold → You're safe!
- **YELLOW** (⚠️): Stock **50-100%** of threshold → Getting low!
- **RED** (🚨): Stock **< 50%** of threshold → Critical!

**Test it:**
1. Go to Raw Materials
2. Find "Cotton Fabric - White" (Threshold: 150 meters)
3. Stock is 500 → **GREEN** (500 > 150) ✅
4. Edit the material, set stock to 100 → **YELLOW** (100 = 67% of 150) ⚠️
5. Set stock to 50 → **RED** (50 = 33% of 150) 🚨
6. Dashboard will show alert cards!

---

### **2. Bill of Materials (BOM) Deep Dive**

BOM links raw materials to finished products:

**Example: "Classic White T-Shirt" BOM**
```
Cotton Fabric - White:     2.5 meters
Polyester Thread - White:  1 spool
Plastic Buttons:           4 pieces
Fabric Labels - Brand:     1 piece
Care Labels:               1 piece
Size Tags - M:             1 piece
```

**When you "Use" 1 T-Shirt:**
- All these materials automatically deduct from stock!
- Activity log records each deduction
- Real-time stock updates
- Threshold alerts update automatically

**Create your own BOM:**
1. Add a new finished product
2. Click "Edit BOM"
3. Click "Add Material"
4. Select material type (Raw/Packaging)
5. Select specific material
6. Enter quantity per unit
7. Save!

---

### **3. Activity Logging**

Every action is tracked:

**Actions tracked:**
- `MATERIAL_ADDED` - New raw material added
- `MATERIAL_UPDATED` - Stock changed
- `MATERIAL_DELETED` - Material removed
- `PACKAGING_ADDED` - New packaging added
- `PACKAGING_UPDATED` - Packaging stock changed
- `PACKAGING_DELETED` - Packaging removed
- `PRODUCT_ADDED` - New finished product
- `PRODUCT_UPDATED` - Product details changed
- `PRODUCT_USED` - Product consumed (triggers BOM deduction)
- `PRODUCT_DELETED` - Product removed

**Each log entry includes:**
- Timestamp (exact date/time)
- Action type
- Material/Product name
- Quantity changed
- Detailed description
- Category

**Export to Excel:**
- Filter activities by date/type
- Click "Export to Excel"
- Get formatted XLSX file
- Includes all filtered data

---

### **4. Image Upload**

Upload images for materials and products:

**Supported:**
- PNG, JPG, JPEG, GIF
- Max 5MB per image
- Stored in browser (IndexedDB)
- Automatic thumbnails

**How to upload:**
1. Edit any material/product
2. Look for "Upload Image" section
3. Click "Choose File"
4. Select image from computer
5. Image displays instantly
6. Save the material/product

---

### **5. Excel Export**

Export data from two places:

**Activity Log Export:**
- Includes all filtered activities
- Columns: Timestamp, Action, Material Name, Quantity, Description, Category
- XLSX format
- Opens in Excel/Google Sheets

**Reports Export:**
- Full inventory snapshot
- Multiple sheets (Raw, Packaging, Finished)
- Includes stock levels, thresholds, categories
- Formatted and ready for analysis

---

## 🐛 Troubleshooting

### **Problem: "Loading..." forever**

**Solution:**
1. Open browser console (F12 → Console tab)
2. Look for red error messages
3. Check for:
   - Network errors → Check internet connection
   - 401/403 errors → API key issue
   - 404 errors → Tables not created

4. Verify tables exist:
   - Supabase → Table Editor
   - Should see: `raw_materials`, `packaging_materials`, `finished_products`, `activity_logs`

5. Verify data loaded:
   - Click on each table
   - Should see rows of data

---

### **Problem: "No data" in tabs**

**Solution:**
1. Did you run `SAMPLE_DATA.sql`?
   - Go to Supabase → SQL Editor
   - Run the script again

2. Check browser console for errors

3. Check Network tab (F12 → Network):
   - Look for failed requests
   - Check response errors

---

### **Problem: Login fails**

**Solution:**
1. Default credentials:
   - Username: `mnemosyne`
   - Password: `mnemosyne000`

2. Check browser console for auth errors

3. Try clearing browser cache:
   - Ctrl/Cmd + Shift + Delete
   - Clear "Cached images and files"
   - Clear "Cookies and other site data"
   - Reload page

---

### **Problem: BOM deduction not working**

**Solution:**
1. Check product HAS a BOM:
   - Edit the product
   - Click "View/Edit BOM"
   - Should see materials listed

2. Products WITH BOMs (from sample data):
   - Classic White T-Shirt ✅
   - Classic Black T-Shirt ✅
   - Denim Jeans - Blue ✅
   - Hoodie - Gray ✅

3. Check browser console:
   - Should see BOM processing logs
   - Look for errors

4. Check Activity Log:
   - Should see deduction entries
   - One for each material in BOM

---

### **Problem: Images not uploading**

**Solution:**
1. Check file size: Max 5MB
2. Check format: PNG, JPG, JPEG, GIF only
3. Try a smaller image
4. Check browser console for errors
5. Make sure you clicked "Save" after selecting image

---

### **Problem: Excel export not working**

**Solution:**
1. Check browser allows downloads
2. Check popup blocker (should allow downloads)
3. Look in browser Downloads folder
4. Try different browser (Chrome/Firefox/Edge)

---

## 💡 Pro Tips

1. **Start with Sample Data** → Much easier to test features with real data

2. **Test BOM First** → It's the most complex feature, validate it works

3. **Check Activity Log Often** → Every action should appear there immediately

4. **Use Threshold System** → Set realistic monthly thresholds for materials

5. **Export Regularly** → Test Excel export to ensure reporting works

6. **Test Responsive** → Try different screen sizes (mobile/tablet/desktop)

7. **Watch the Console** → Keep F12 console open during testing to catch errors early

8. **Test Password Reset** → Try the "Forgot Password" flow (requires EmailJS setup)

9. **Customize Sample Data** → Edit materials/products to match your actual inventory

10. **Create Real BOMs** → Link materials to products that make sense for your business

---

## 📊 Sample Data Overview

### **Raw Materials (35+ items)**

**Categories:**
- Textiles (6 items) - Fabrics like Cotton, Denim, Silk
- Sewing Supplies (6 items) - Thread, Zippers, Elastic
- Hardware (6 items) - Buttons, Rivets, Fasteners
- Labels (7 items) - Brand Labels, Care Tags, Size Tags
- Trims (6 items) - Lace, Ribbon, Velcro
- Packaging Inserts (4 items) - Tissue Paper, Stickers

### **Packaging Materials (28 items)**
- Boxes (6 types)
- Bags (8 types)
- Protective Materials (5 types)
- Tape & Adhesives (5 types)
- Labels & Documentation (4 types)

### **Finished Products (23 items)**
- T-Shirts (5 styles)
- Pants & Bottoms (5 styles)
- Dresses & Skirts (4 styles)
- Outerwear (4 styles)
- Accessories (5 items)

### **Activity Logs (20+ entries)**
- Spanning last 30 days
- Mix of all action types
- Realistic descriptions
- Proper timestamps

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────┐
│         MNEMOSYNE INVENTORY SYSTEM              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (React + TypeScript + Tailwind)      │
│  ├─ Authentication (Username/Password)         │
│  ├─ Dashboard (Charts + Alerts)                │
│  ├─ Raw Materials CRUD                         │
│  ├─ Packaging Materials CRUD                   │
│  ├─ Finished Products CRUD + BOM               │
│  ├─ Reports (Analytics + Export)               │
│  └─ Activity Log (Audit Trail)                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Backend (Supabase PostgreSQL)                 │
│  ├─ raw_materials table                        │
│  ├─ packaging_materials table                  │
│  ├─ finished_products table                    │
│  ├─ activity_logs table                        │
│  └─ Real-time updates                          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Features                                       │
│  ├─ Bill of Materials (BOM)                    │
│  ├─ Auto Raw Material Deduction                │
│  ├─ Monthly Threshold Alerts (3-color)         │
│  ├─ Image Upload (Materials + Products)        │
│  ├─ Excel Export (Reports + Activity)          │
│  ├─ Motion Animations (Smooth transitions)     │
│  ├─ Password Reset (EmailJS)                   │
│  ├─ Account Settings                           │
│  └─ Fully Responsive (Mobile/Tablet/Desktop)   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 You're Ready!

Your Mnemosyne system is **100% ready to use**!

### **Next Steps:**

1. ✅ **Run SAMPLE_DATA.sql** in Supabase (if not done yet)
2. ✅ **Start the app** (`npm run dev`)
3. ✅ **Login** (mnemosyne / mnemosyne000)
4. ✅ **Explore all tabs**
5. ✅ **Test the BOM feature**
6. ✅ **Check Activity Log**
7. ✅ **Export reports**
8. ✅ **Customize for your needs**

---

**🎉 Enjoy your fully connected Mnemosyne Inventory Management System! 🎉**

**Questions? Check:**
- `CONNECTION_SUCCESS.md` - Detailed connection guide
- `SAMPLE_DATA.sql` - Database sample data
- Browser Console (F12) - Real-time debug logs
- Supabase Dashboard - Database management

**Happy Inventory Managing! 📦✨**
