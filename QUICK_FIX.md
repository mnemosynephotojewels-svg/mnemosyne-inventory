# 🚨 QUICK FIX - Stock Columns Missing

## Copy & Paste This SQL

Open your **Supabase SQL Editor** and run:

```sql
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS previous_stock NUMERIC;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS new_stock NUMERIC;
```

That's it! ✅

## Verify It Worked

After running the SQL, you should see:
- ✅ No errors in console
- ✅ Deductions work correctly
- ✅ Activity details show stock information

---

**Need more help?** See `/FIX_STOCK_COLUMNS_GUIDE.md` for detailed instructions.
