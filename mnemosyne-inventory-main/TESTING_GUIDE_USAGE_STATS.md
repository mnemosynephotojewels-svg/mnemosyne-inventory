# 🧪 TESTING GUIDE - Usage Statistics Fix

## 📋 What to Test

Test if the Finished Products and Raw Materials usage statistics are now counting correctly in the Reports tab.

## ⚠️ IMPORTANT: What Gets Counted

### **Raw Materials Usage:**
- ✅ **COUNTS**: Direct deductions (clicking "Deduct" button)
- ✅ **COUNTS**: Materials used in production (via Bill of Materials)
- ❌ **DOES NOT COUNT**: Adding stock (this is correct - we track usage, not additions)

### **Finished Products Usage:**
- ✅ **COUNTS**: Products produced/used (clicking "Use" button)
- ❌ **DOES NOT COUNT**: Adding stock to finished products

**This is correct behavior!** Usage statistics track consumption, not inventory additions.

## 🔍 Step-by-Step Testing

### **Step 1: Open Browser Console**
1. Press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Keep this open throughout testing

### **Step 2: Produce a Finished Product**
1. Go to **Finished Products** tab
2. Find any product that has a **Bill of Materials** configured
3. Click the **"Use"** button
4. Enter a quantity (e.g., **5 units**)
5. Click **Confirm**

### **Step 3: Check Console Logs (Production)**
Look for these logs in the console:

```
🎯 ========================================
🎯 STARTING DEDUCTION PROCESS
🎯 Product ID: product-xxx
🎯 Quantity to produce: 5
📦 Product found: [Product Name]
📋 Bill of Materials: [...]
✅ Found material: [Material Name]
📝 Creating main PRODUCT_DEDUCTED log...
📝 Main Product Log Details: {
  "action": "PRODUCT_DEDUCTED",
  "productName": "[Product Name]",
  "quantity": 5,
  "affectedMaterials": [ ... ]
}
📦 Adding activity log: PRODUCT_DEDUCTED
📦 Log details: { productName: "...", quantity: 5, affectedMaterials: [...] }
✅✅✅ Successfully saved to Supabase database!
✅ Main PRODUCT_DEDUCTED log created with affected materials: [...]
🎉 DEDUCTION COMPLETE!
```

**❌ If you DON'T see these logs:**
- The PRODUCT_DEDUCTED log is NOT being created
- Check if the product has a Bill of Materials configured

### **Step 4: Reload the Page**
1. Press **F5** to reload the page
2. Log in again if needed

### **Step 5: Check Console Logs (Loading)**
When the page loads, look for:

```
📦 Fetching activity logs from Supabase...
🔍 Loaded PRODUCT_DEDUCTED log: {
  productName: "[Product Name]",
  quantity: 5,
  affectedMaterials: [ ... ]
}
✅ Loaded X activity logs from Supabase
```

**❌ If you DON'T see `PRODUCT_DEDUCTED` logs:**
- The logs were NOT saved to the database
- OR the database column `product_name` doesn't exist
- OR the logs were saved with wrong action name

### **Step 6: Go to Reports Tab**
1. Click on the **Reports** tab
2. Make sure **"Finished Products"** is selected in the dropdown

### **Step 7: Check Console Logs (Processing)**
When you're on the Reports tab, look for:

```
🔍 USAGE STATS CALCULATION
Report Type: finished
Date Filtered Logs: X
🔎 Processing log: {
  action: "PRODUCT_DEDUCTED",
  productName: "[Product Name]",
  quantity: 5,
  affectedMaterials: [...]
}
📊 Finished Product Usage: [Product Name] +5 (Total: 15)
✅ Final Usage Stats: X items
```

**✅ SUCCESS:** You should see `📊 Finished Product Usage` logs with the correct quantities!

**❌ If you DON'T see these logs:**
- The ReportsTab is NOT processing the logs
- Check if `log.action === 'PRODUCT_DEDUCTED'` condition is being met
- Check if `log.productName` exists

### **Step 8: Verify in the UI**
1. In the Reports tab, look at the **Usage Statistics** table
2. Find your product in the list
3. Check the **Weekly**, **Monthly**, and **Yearly** columns

**✅ SUCCESS:** The numbers should match your production!

**❌ If the numbers are still 0:**
- The counting logic has an issue
- Check the console logs to see which step failed

## 🐛 Troubleshooting

### **Problem: No logs appear in console**
**Solution:** Make sure the browser console is open (F12)

### **Problem: `PRODUCT_DEDUCTED` log not created**
**Possible causes:**
- Product has no Bill of Materials
- JavaScript error during production
- Network error communicating with Supabase

**Check:**
- Console for error messages (red text)
- Network tab for failed requests

### **Problem: Log created but not loaded**
**Possible causes:**
- Database doesn't have the `product_name` column
- Network timeout (too many logs)
- JSON parsing error for `affected_materials`

**Check:**
- Console for warnings about missing columns
- Supabase dashboard → SQL Editor → Run:
  ```sql
  SELECT * FROM activity_logs_a9dec19d 
  WHERE action = 'PRODUCT_DEDUCTED' 
  LIMIT 5;
  ```

### **Problem: Log loaded but not counted**
**Possible causes:**
- `log.productName` is undefined
- Action name doesn't match exactly "PRODUCT_DEDUCTED"
- Date filtering excludes the log

**Check:**
- Console for `🔎 Processing log:` to see actual values
- Make sure date filter is set to "All Time"

## 📊 Expected Console Output (Complete Flow)

### **1. Production:**
```
🎯 STARTING DEDUCTION PROCESS
✅ Found material: Resin
📝 Creating main PRODUCT_DEDUCTED log...
📦 Adding activity log: PRODUCT_DEDUCTED
📦 Log details: { productName: "Photo Memory Necklace", quantity: 5, affectedMaterials: [{...}] }
✅✅✅ Successfully saved to Supabase database!
```

### **2. Page Load:**
```
📦 Fetching activity logs from Supabase...
🔍 Loaded PRODUCT_DEDUCTED log: { productName: "Photo Memory Necklace", quantity: 5, ... }
✅ Loaded 25 activity logs from Supabase
```

### **3. Reports Tab:**
```
🔍 USAGE STATS CALCULATION
Report Type: finished
🔎 Processing log: { action: "PRODUCT_DEDUCTED", productName: "Photo Memory Necklace", quantity: 5 }
📊 Finished Product Usage: Photo Memory Necklace +5 (Total: 15)
✅ Final Usage Stats: 12 items
```

## ✅ Success Criteria

- [ ] PRODUCT_DEDUCTED logs are created during production
- [ ] Logs are saved to Supabase database
- [ ] Logs are loaded correctly on page load
- [ ] Logs are processed in ReportsTab
- [ ] Usage statistics show correct numbers
- [ ] Numbers appear in the UI table

If all checkboxes are ✅, the fix is working correctly!

---

**Last Updated:** March 9, 2026