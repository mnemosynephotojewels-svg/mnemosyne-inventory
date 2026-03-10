# Monthly Threshold Feature Setup Guide

## Overview
The system has been updated with a **Monthly Threshold** feature for Raw Materials. This allows you to set custom low-stock alert levels for each material.

## New Stock Color System

### 🔴 Red - Out of Stock
- **Condition**: Stock = 0
- **Status**: "Out of Stock"
- **Action**: Urgent reorder required

### 🟠 Orange - Low Stock
- **Condition**: Stock > 0 AND Stock < Monthly Threshold
- **Status**: "Low Stock"
- **Action**: Reorder soon recommended

### 🟢 Green - Safe Stock
- **Condition**: Stock >= Monthly Threshold
- **Status**: "Safe"
- **Action**: No action needed

## How to Use

### 1. Database Setup (REQUIRED)
Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE raw_materials 
ADD COLUMN IF NOT EXISTS monthly_threshold INTEGER DEFAULT NULL;
```

Or simply run the file: `/ADD_MONTHLY_THRESHOLD_COLUMN.sql`

### 2. Setting Monthly Threshold

#### When Adding a New Material:
1. Click "Add Material" in the Raw Materials tab
2. Fill in all material details
3. Set the "Monthly Threshold" value (e.g., 50)
   - This is the minimum stock level you want to maintain
   - When stock falls below this value, it will be marked as "Low Stock" (orange)
4. Click "Add Material"

#### When Editing an Existing Material:
1. Click the edit button (pencil icon) on any material card
2. Update the "Monthly Threshold" value
3. Click "Save Changes"

### 3. Default Behavior
- If Monthly Threshold is not set (or set to 0), the system uses a default threshold of 20 units
- You can customize this for each material based on your usage patterns

## Dashboard Changes

The Dashboard now shows more detailed stock alerts:

### Stock Alert Card
- Shows total count of out-of-stock and low-stock materials
- Displays separate counts:
  - "X out of stock" (red)
  - "Y low stock" (orange)

### Material Level Gauges
- Red: Out of stock (0 units)
- Orange: Low stock (below threshold)
- Green: Safe stock (above threshold)

## Filter Updates

The Raw Materials filter dropdown now shows:
- **Out of Stock (0)** - Materials with 0 stock
- **Low Stock (Below Threshold)** - Materials below their monthly threshold
- **Safe Stock (Above Threshold)** - Materials above their monthly threshold

## Benefits

1. **Customizable Alerts**: Each material can have its own threshold based on usage
2. **Better Planning**: Orange alerts give you time to reorder before running out
3. **Clear Prioritization**: Red alerts highlight critical situations (out of stock)
4. **Accurate Tracking**: Thresholds can match your actual monthly consumption

## Example Use Cases

### High-Usage Material
- Material: "Gold Chain"
- Monthly Usage: ~100 pieces
- Monthly Threshold: 80
- **Result**: Alert when stock drops below 80, giving time to reorder

### Low-Usage Material
- Material: "Special Clasp"
- Monthly Usage: ~10 pieces
- Monthly Threshold: 15
- **Result**: Alert when stock drops below 15, ensuring you never run out

### Seasonal Material
- Material: "Holiday Pendant"
- Normal Threshold: 20
- Holiday Season Threshold: 100
- **Result**: Adjust threshold based on season to prevent stockouts

## Tips

1. **Set Realistic Thresholds**: Base them on actual monthly consumption
2. **Review Regularly**: Adjust thresholds as usage patterns change
3. **Use Activity Log**: Check historical data to determine optimal thresholds
4. **Monitor Dashboard**: Regularly check the stock alerts card
5. **Plan Ahead**: Orange alerts mean you have time to reorder without urgency

## Troubleshooting

**Q: Why is my material showing as "Low Stock" when I have plenty?**
A: Check your Monthly Threshold setting - it might be set too high. Adjust it to match your actual monthly consumption.

**Q: Can I use different thresholds for different materials?**
A: Yes! Each material has its own Monthly Threshold field. Set it based on each material's usage pattern.

**Q: What if I don't set a Monthly Threshold?**
A: The system will use a default threshold of 20 units. We recommend setting custom thresholds for better accuracy.

**Q: How do I see which materials are out of stock vs. low stock?**
A: Use the filter dropdown in Raw Materials tab:
- Select "Out of Stock (0)" to see materials with 0 stock
- Select "Low Stock (Below Threshold)" to see materials below their threshold
