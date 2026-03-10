# ✅ Raw Materials Usage Statistics - Clarification

## 🎯 What Gets Counted in Raw Materials Usage

The Raw Materials usage statistics in the Reports tab **ONLY counts materials that are USED/CONSUMED**, not materials that are added to stock.

### ✅ **What IS Counted (Usage):**

1. **Direct Material Deductions** (`MATERIAL_DEDUCTED`)
   - When you click "Deduct" on a raw material
   - These are logged with `action: 'MATERIAL_DEDUCTED'`
   - Example: Deducting 20 units of Resin directly

2. **Materials Used in Production** (`PRODUCT_DEDUCTED` → `affectedMaterials`)
   - When you produce a finished product that uses raw materials
   - The Bill of Materials (BOM) is tracked in `affectedMaterials` array
   - Example: Producing 5 Photo Memory Necklaces that use 10 units of Resin each

### ❌ **What is NOT Counted (Stock Additions):**

1. **Adding New Raw Materials** (`MATERIAL_ADDED`)
   - When you create a new raw material entry
   - Action: `MATERIAL_ADDED`

2. **Updating Stock (Adding Stock)** (`MATERIAL_ADDED`)
   - When you edit a raw material and increase the stock
   - Action: `MATERIAL_ADDED`

## 🔍 How to Verify

When you open the Reports tab and select "Raw Materials", open the browser console (F12) and you'll see:

### **For Deductions (Counted):**
```
🔎 Processing log: { action: "MATERIAL_DEDUCTED", materialName: "Resin", quantity: 20 }
📊 Raw Material Deduction: Resin +20 (Total: 45)
```

### **For Production (Counted):**
```
🔎 Processing log: { action: "PRODUCT_DEDUCTED", affectedMaterials: [...] }
📦 Processing BOM for product deduction: [{ materialName: "Resin", quantity: 10 }]
📊 Raw Material from BOM: Resin +10 (Total: 55)
```

### **For Stock Additions (NOT Counted - Skipped):**
```
🔎 Processing log: { action: "MATERIAL_ADDED", materialName: "Resin", quantity: 50 }
⏭️ Skipping MATERIAL_ADDED (not usage): Resin
```

## 📊 Why This Makes Sense

**Usage statistics should track consumption, not inventory additions.**

- **Purpose**: Understand which materials are being used the most
- **Business Value**: Identify high-consumption materials for better purchasing decisions
- **Stock Management**: See which materials need reordering based on usage patterns

If we counted stock additions, the numbers would be inflated and wouldn't represent actual consumption.

## 🧪 Test Scenarios

### **Scenario 1: Add Stock to Raw Material**
1. Go to Raw Materials tab
2. Edit a material and increase stock from 100 to 150
3. Go to Reports tab → Raw Materials
4. **Expected Result**: Usage statistics do NOT increase
5. **Console**: `⏭️ Skipping MATERIAL_ADDED (not usage): [Material Name]`

### **Scenario 2: Deduct Material Directly**
1. Go to Raw Materials tab
2. Click "Deduct" on a material
3. Enter quantity and reason
4. Go to Reports tab → Raw Materials
5. **Expected Result**: Usage statistics INCREASE by the deducted amount
6. **Console**: `📊 Raw Material Deduction: [Material Name] +[Quantity]`

### **Scenario 3: Produce Finished Product**
1. Go to Finished Products tab
2. Click "Use" on a product with BOM configured
3. Enter production quantity
4. Go to Reports tab → Raw Materials
5. **Expected Result**: Usage statistics INCREASE for all materials in BOM
6. **Console**: `📊 Raw Material from BOM: [Material Name] +[Quantity]`

## ✅ Confirmation

The system is working **CORRECTLY** if:
- ✅ Stock additions show: `⏭️ Skipping MATERIAL_ADDED`
- ✅ Direct deductions show: `📊 Raw Material Deduction`
- ✅ Production shows: `📊 Raw Material from BOM`
- ✅ Usage numbers only increase for deductions and production
- ✅ Usage numbers do NOT increase when adding stock

## 🎉 Summary

**Raw Materials usage statistics correctly track CONSUMPTION, not ADDITIONS.**

- ✅ Direct material deductions ARE counted
- ✅ Materials used in production (via BOM) ARE counted  
- ❌ Stock additions are NOT counted (by design)
- ❌ New material creation is NOT counted (by design)

This is the correct behavior for usage/consumption tracking!

---

**Last Updated:** March 9, 2026
**Status:** ✅ WORKING AS DESIGNED
