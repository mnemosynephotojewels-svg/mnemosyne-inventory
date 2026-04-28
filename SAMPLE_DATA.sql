-- =====================================================
-- MNEMOSYNE - SAMPLE DATA
-- =====================================================
-- This SQL adds sample inventory data to your system
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. RAW MATERIALS - Sample Data
-- =====================================================

INSERT INTO raw_materials (name, stock, unit, category, description, monthly_threshold) VALUES
-- Textiles & Fabrics
('Cotton Fabric - White', 500, 'meters', 'Textiles', 'Premium 100% cotton fabric, white color', 150),
('Cotton Fabric - Black', 450, 'meters', 'Textiles', 'Premium 100% cotton fabric, black color', 150),
('Denim Fabric', 300, 'meters', 'Textiles', 'Heavy-duty denim fabric for jeans', 100),
('Silk Fabric', 200, 'meters', 'Textiles', 'Luxury silk fabric for premium products', 50),
('Polyester Blend', 600, 'meters', 'Textiles', 'Polyester-cotton blend fabric', 200),
('Linen Fabric', 250, 'meters', 'Textiles', 'Natural linen fabric, breathable', 80),

-- Sewing Supplies
('Polyester Thread - White', 1000, 'spools', 'Sewing Supplies', 'High-strength polyester thread', 300),
('Polyester Thread - Black', 950, 'spools', 'Sewing Supplies', 'High-strength polyester thread', 300),
('Cotton Thread - Assorted', 500, 'spools', 'Sewing Supplies', 'Multi-color cotton thread pack', 150),
('Elastic Bands', 800, 'meters', 'Sewing Supplies', 'Elastic bands for waistbands', 200),
('Zippers - Metal', 2000, 'pieces', 'Sewing Supplies', 'Heavy-duty metal zippers', 500),
('Zippers - Plastic', 2500, 'pieces', 'Sewing Supplies', 'Lightweight plastic zippers', 600),

-- Hardware & Fasteners
('Metal Buttons - Silver', 3000, 'pieces', 'Hardware', 'Silver-plated metal buttons, 15mm', 800),
('Metal Buttons - Gold', 2500, 'pieces', 'Hardware', 'Gold-plated metal buttons, 15mm', 700),
('Plastic Buttons - Assorted', 4000, 'pieces', 'Hardware', 'Multi-color plastic buttons', 1000),
('Snap Fasteners', 1500, 'pieces', 'Hardware', 'Metal snap fasteners', 400),
('Rivets - Brass', 1200, 'pieces', 'Hardware', 'Brass rivets for denim', 300),
('Hooks & Eyes', 2000, 'pieces', 'Hardware', 'Metal hooks and eyes for garments', 500),

-- Labels & Tags
('Fabric Labels - Brand', 5000, 'pieces', 'Labels', 'Woven brand labels', 1000),
('Care Labels', 8000, 'pieces', 'Labels', 'Washing care instruction labels', 2000),
('Size Tags - S', 1500, 'pieces', 'Labels', 'Size S tags', 400),
('Size Tags - M', 2000, 'pieces', 'Labels', 'Size M tags', 500),
('Size Tags - L', 1800, 'pieces', 'Labels', 'Size L tags', 450),
('Size Tags - XL', 1200, 'pieces', 'Labels', 'Size XL tags', 350),
('Price Tags', 3000, 'pieces', 'Labels', 'Blank price tags with string', 800),

-- Trims & Accessories
('Lace Trim - White', 400, 'meters', 'Trims', 'Decorative lace trim', 100),
('Lace Trim - Black', 350, 'meters', 'Trims', 'Decorative lace trim', 90),
('Ribbon - Satin', 600, 'meters', 'Trims', 'Satin ribbon for decoration', 150),
('Velcro Strips', 800, 'meters', 'Trims', 'Hook and loop fastener strips', 200),
('Shoulder Pads', 500, 'pairs', 'Trims', 'Foam shoulder pads', 120),
('Interfacing', 400, 'meters', 'Trims', 'Iron-on interfacing for collars', 100),

-- Packaging Inserts
('Tissue Paper - White', 1000, 'sheets', 'Packaging Inserts', 'White tissue paper for wrapping', 300),
('Tissue Paper - Colored', 800, 'sheets', 'Packaging Inserts', 'Colored tissue paper assorted', 250),
('Stickers - Logo', 5000, 'pieces', 'Packaging Inserts', 'Brand logo stickers', 1200),
('Thank You Cards', 2000, 'pieces', 'Packaging Inserts', 'Customer thank you cards', 500);

-- =====================================================
-- 2. PACKAGING MATERIALS - Sample Data
-- =====================================================

INSERT INTO packaging_materials (name, stock, unit, monthly_threshold) VALUES
-- Boxes & Containers
('Small Cardboard Box (20x15x10cm)', 500, 'boxes', 150),
('Medium Cardboard Box (30x25x15cm)', 400, 'boxes', 120),
('Large Cardboard Box (40x35x20cm)', 300, 'boxes', 90),
('Extra Large Box (50x45x30cm)', 200, 'boxes', 60),
('Gift Boxes - Small', 600, 'boxes', 180),
('Gift Boxes - Large', 400, 'boxes', 120),

-- Bags & Pouches
('Poly Mailer Bags - Small', 1000, 'bags', 300),
('Poly Mailer Bags - Medium', 800, 'bags', 250),
('Poly Mailer Bags - Large', 600, 'bags', 180),
('Plastic Shopping Bags', 2000, 'bags', 600),
('Paper Shopping Bags - Small', 1200, 'bags', 350),
('Paper Shopping Bags - Large', 800, 'bags', 240),
('Organza Pouches', 1500, 'pouches', 400),
('Zip Lock Bags', 2500, 'bags', 750),

-- Protective Materials
('Bubble Wrap Roll', 50, 'rolls', 15),
('Air Pillows', 3000, 'pieces', 900),
('Packing Peanuts', 100, 'bags', 30),
('Foam Sheets', 500, 'sheets', 150),
('Corrugated Inserts', 800, 'pieces', 240),

-- Tape & Adhesives
('Packing Tape - Clear', 200, 'rolls', 60),
('Packing Tape - Brown', 150, 'rolls', 45),
('Double-Sided Tape', 100, 'rolls', 30),
('Masking Tape', 80, 'rolls', 25),
('Fragile Stickers', 1000, 'sheets', 300),

-- Labels & Documentation
('Shipping Labels - A4', 500, 'sheets', 150),
('Address Labels', 1000, 'sheets', 300),
('Barcode Labels', 800, 'sheets', 240),
('Packing Slips', 2000, 'sheets', 600),
('Invoice Envelopes', 1500, 'envelopes', 450);

-- =====================================================
-- 3. FINISHED PRODUCTS - Sample Data
-- =====================================================

-- First, let's create some finished products
-- Note: We'll use placeholder bill_of_materials for now
-- In a real scenario, you'd reference actual material IDs

INSERT INTO finished_products (name, category, sub_category, gender, quantity, stock, bill_of_materials) VALUES
-- T-Shirts
('Classic White T-Shirt', 'Apparel', 'Tops', 'Unisex', 100, 100, '[]'::jsonb),
('Classic Black T-Shirt', 'Apparel', 'Tops', 'Unisex', 95, 95, '[]'::jsonb),
('V-Neck T-Shirt - White', 'Apparel', 'Tops', 'Women', 75, 75, '[]'::jsonb),
('Polo Shirt - Navy', 'Apparel', 'Tops', 'Men', 60, 60, '[]'::jsonb),
('Graphic T-Shirt - Logo', 'Apparel', 'Tops', 'Unisex', 80, 80, '[]'::jsonb),

-- Pants & Bottoms
('Denim Jeans - Blue', 'Apparel', 'Bottoms', 'Unisex', 50, 50, '[]'::jsonb),
('Denim Jeans - Black', 'Apparel', 'Bottoms', 'Unisex', 45, 45, '[]'::jsonb),
('Cargo Pants - Khaki', 'Apparel', 'Bottoms', 'Men', 40, 40, '[]'::jsonb),
('Leggings - Black', 'Apparel', 'Bottoms', 'Women', 70, 70, '[]'::jsonb),
('Chino Shorts', 'Apparel', 'Bottoms', 'Men', 55, 55, '[]'::jsonb),

-- Dresses & Skirts
('Summer Dress - Floral', 'Apparel', 'Dresses', 'Women', 35, 35, '[]'::jsonb),
('Maxi Dress - Solid', 'Apparel', 'Dresses', 'Women', 30, 30, '[]'::jsonb),
('Midi Skirt - Pleated', 'Apparel', 'Skirts', 'Women', 40, 40, '[]'::jsonb),
('Mini Skirt - Denim', 'Apparel', 'Skirts', 'Women', 45, 45, '[]'::jsonb),

-- Outerwear
('Denim Jacket', 'Apparel', 'Outerwear', 'Unisex', 25, 25, '[]'::jsonb),
('Hoodie - Gray', 'Apparel', 'Outerwear', 'Unisex', 60, 60, '[]'::jsonb),
('Windbreaker - Black', 'Apparel', 'Outerwear', 'Unisex', 35, 35, '[]'::jsonb),
('Cardigan - Knit', 'Apparel', 'Outerwear', 'Women', 40, 40, '[]'::jsonb),

-- Accessories
('Baseball Cap - Black', 'Accessories', 'Headwear', 'Unisex', 120, 120, '[]'::jsonb),
('Beanie - Winter', 'Accessories', 'Headwear', 'Unisex', 90, 90, '[]'::jsonb),
('Canvas Tote Bag', 'Accessories', 'Bags', 'Unisex', 85, 85, '[]'::jsonb),
('Leather Belt - Brown', 'Accessories', 'Belts', 'Unisex', 65, 65, '[]'::jsonb),
('Cotton Socks - Pack of 3', 'Accessories', 'Socks', 'Unisex', 150, 150, '[]'::jsonb);

-- =====================================================
-- 4. ACTIVITY LOGS - Sample Data
-- =====================================================

INSERT INTO activity_logs (action, material_name, quantity, description, category, timestamp) VALUES
-- Recent activity from the last 30 days
('MATERIAL_ADDED', 'Cotton Fabric - White', 500, 'Initial stock replenishment', 'raw_material', NOW() - INTERVAL '25 days'),
('MATERIAL_ADDED', 'Cotton Fabric - Black', 450, 'Initial stock replenishment', 'raw_material', NOW() - INTERVAL '25 days'),
('MATERIAL_ADDED', 'Polyester Thread - White', 1000, 'Bulk order received', 'raw_material', NOW() - INTERVAL '24 days'),
('PACKAGING_ADDED', 'Small Cardboard Box (20x15x10cm)', 500, 'Monthly packaging order', 'packaging_material', NOW() - INTERVAL '23 days'),
('PACKAGING_ADDED', 'Poly Mailer Bags - Small', 1000, 'Stock replenishment', 'packaging_material', NOW() - INTERVAL '23 days'),

('PRODUCT_ADDED', 'Classic White T-Shirt', 100, 'New product added to inventory', 'finished_product', NOW() - INTERVAL '20 days'),
('PRODUCT_ADDED', 'Classic Black T-Shirt', 95, 'New product added to inventory', 'finished_product', NOW() - INTERVAL '20 days'),
('PRODUCT_ADDED', 'Denim Jeans - Blue', 50, 'New product added to inventory', 'finished_product', NOW() - INTERVAL '18 days'),

('MATERIAL_UPDATED', 'Cotton Fabric - White', 50, 'Stock adjustment - material used in production', 'raw_material', NOW() - INTERVAL '15 days'),
('PRODUCT_USED', 'Classic White T-Shirt', -5, 'Products shipped to customer', 'finished_product', NOW() - INTERVAL '12 days'),
('PRODUCT_USED', 'Classic Black T-Shirt', -3, 'Products shipped to customer', 'finished_product', NOW() - INTERVAL '10 days'),

('MATERIAL_ADDED', 'Zippers - Metal', 2000, 'Quarterly bulk order', 'raw_material', NOW() - INTERVAL '8 days'),
('PACKAGING_UPDATED', 'Bubble Wrap Roll', -5, 'Used for shipments', 'packaging_material', NOW() - INTERVAL '7 days'),
('PRODUCT_USED', 'Denim Jeans - Blue', -2, 'Customer order fulfilled', 'finished_product', NOW() - INTERVAL '5 days'),

('MATERIAL_UPDATED', 'Metal Buttons - Silver', 100, 'Stock count adjustment', 'raw_material', NOW() - INTERVAL '3 days'),
('PACKAGING_ADDED', 'Paper Shopping Bags - Small', 300, 'Emergency restock', 'packaging_material', NOW() - INTERVAL '2 days'),
('PRODUCT_ADDED', 'Hoodie - Gray', 60, 'Winter collection added', 'finished_product', NOW() - INTERVAL '1 day'),

('MATERIAL_ADDED', 'Fabric Labels - Brand', 5000, 'New label batch received', 'raw_material', NOW() - INTERVAL '12 hours'),
('PRODUCT_USED', 'Baseball Cap - Black', -8, 'Bulk order shipped', 'finished_product', NOW() - INTERVAL '6 hours'),
('MATERIAL_UPDATED', 'Polyester Thread - Black', -20, 'Used in production', 'raw_material', NOW() - INTERVAL '2 hours');

-- =====================================================
-- UPDATE FINISHED PRODUCTS WITH PROPER BILL OF MATERIALS
-- =====================================================
-- This section updates the finished products with actual material references
-- We need to get the IDs of materials and link them to products

-- Update Classic White T-Shirt BOM
UPDATE finished_products 
SET bill_of_materials = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'material_id', id::text,
      'quantity', qty,
      'type', mat_type
    )
  )
  FROM (
    SELECT id, 2.5 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Cotton Fabric - White'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Polyester Thread - White'
    UNION ALL
    SELECT id, 4 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Plastic Buttons - Assorted'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Fabric Labels - Brand'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Care Labels'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Size Tags - M'
  ) materials
)
WHERE name = 'Classic White T-Shirt';

-- Update Classic Black T-Shirt BOM
UPDATE finished_products 
SET bill_of_materials = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'material_id', id::text,
      'quantity', qty,
      'type', mat_type
    )
  )
  FROM (
    SELECT id, 2.5 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Cotton Fabric - Black'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Polyester Thread - Black'
    UNION ALL
    SELECT id, 4 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Plastic Buttons - Assorted'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Fabric Labels - Brand'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Care Labels'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Size Tags - M'
  ) materials
)
WHERE name = 'Classic Black T-Shirt';

-- Update Denim Jeans BOM
UPDATE finished_products 
SET bill_of_materials = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'material_id', id::text,
      'quantity', qty,
      'type', mat_type
    )
  )
  FROM (
    SELECT id, 1.8 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Denim Fabric'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Polyester Thread - White'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Zippers - Metal'
    UNION ALL
    SELECT id, 5 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Rivets - Brass'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Metal Buttons - Silver'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Fabric Labels - Brand'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Care Labels'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Size Tags - M'
  ) materials
)
WHERE name = 'Denim Jeans - Blue';

-- Update Hoodie BOM
UPDATE finished_products 
SET bill_of_materials = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'material_id', id::text,
      'quantity', qty,
      'type', mat_type
    )
  )
  FROM (
    SELECT id, 2.0 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Cotton Fabric - White'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Polyester Thread - White'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Zippers - Plastic'
    UNION ALL
    SELECT id, 0.5 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Elastic Bands'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Fabric Labels - Brand'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Care Labels'
    UNION ALL
    SELECT id, 1 as qty, 'raw' as mat_type FROM raw_materials WHERE name = 'Size Tags - L'
  ) materials
)
WHERE name = 'Hoodie - Gray';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify your data was inserted correctly

-- Count all records
SELECT 
  'Raw Materials' as table_name, COUNT(*) as record_count FROM raw_materials
UNION ALL
SELECT 'Packaging Materials', COUNT(*) FROM packaging_materials
UNION ALL
SELECT 'Finished Products', COUNT(*) FROM finished_products
UNION ALL
SELECT 'Activity Logs', COUNT(*) FROM activity_logs
ORDER BY table_name;

-- Check BOM linkages
SELECT 
  name,
  category,
  stock,
  jsonb_array_length(bill_of_materials) as bom_items
FROM finished_products
WHERE jsonb_array_length(bill_of_materials) > 0
ORDER BY name
LIMIT 10;

-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================
-- Your Mnemosyne system now has:
--   ✅ 35+ Raw Materials across 6 categories
--   ✅ 28 Packaging Materials
--   ✅ 23 Finished Products
--   ✅ 20+ Activity Log entries
--   ✅ Proper Bill of Materials linkages
--
-- You can now test all features of your system!
-- =====================================================
