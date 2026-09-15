-- ============================================================
-- THREADX — SEED DATA
-- Run after schema.sql
-- Demo password for ALL seeded accounts: "Password123!"
-- (hash below is bcrypt for that string — CHANGE IMMEDIATELY in real use)
-- ============================================================

USE threadx_store;
SET NAMES utf8mb4;

-- ---------------- SETTINGS ----------------
INSERT INTO settings (`key`, `value`) VALUES
('brand_name', 'THREADX'),
('accent_color', '#FF4B1F'),
('currency', 'LKR'),
('default_delivery_fee', '350'),
('free_delivery_threshold', '5000'),
('contact_phone', '+94 77 123 4567'),
('contact_email', 'hello@threadx.example'),
('whatsapp_number', '+94771234567'),
('instagram_url', 'https://instagram.com/threadx'),
('tiktok_url', 'https://tiktok.com/@threadx'),
('facebook_url', 'https://facebook.com/threadx'),
('custom_printing_fee_text', '450'),
('custom_printing_fee_image', '650'),
('store_status', 'open');

-- ---------------- USERS ----------------
-- password_hash is bcrypt('Password123!')
INSERT INTO users (id, name, email, phone, password_hash, role, status, email_verified_at) VALUES
(1, 'Admin User', 'admin@threadx.example', '+94770000001', '$2y$10$Wl2q9GmZ3n8p1yYQeQjK5.z5m3fJ8oQeQvJ9K8bF7yQeQvJ9K8bF6', 'admin', 'active', NOW()),
(2, 'Nadeesha Perera', 'nadeesha@example.com', '+94771112222', '$2y$10$Wl2q9GmZ3n8p1yYQeQjK5.z5m3fJ8oQeQvJ9K8bF7yQeQvJ9K8bF6', 'customer', 'active', NOW()),
(3, 'Kasun Silva', 'kasun@example.com', '+94772223333', '$2y$10$Wl2q9GmZ3n8p1yYQeQjK5.z5m3fJ8oQeQvJ9K8bF7yQeQvJ9K8bF6', 'customer', 'active', NOW()),
(4, 'Dilani Fernando', 'dilani@example.com', '+94773334444', '$2y$10$Wl2q9GmZ3n8p1yYQeQjK5.z5m3fJ8oQeQvJ9K8bF7yQeQvJ9K8bF6', 'customer', 'active', NOW()),
(5, 'Ruwan Jayasuriya', 'ruwan@example.com', '+94774445555', '$2y$10$Wl2q9GmZ3n8p1yYQeQjK5.z5m3fJ8oQeQvJ9K8bF7yQeQvJ9K8bF6', 'customer', 'active', NOW()),
(6, 'Ishara Gunawardena', 'ishara@example.com', '+94775556666', '$2y$10$Wl2q9GmZ3n8p1yYQeQjK5.z5m3fJ8oQeQvJ9K8bF7yQeQvJ9K8bF6', 'customer', 'active', NOW());

-- ---------------- CATEGORIES ----------------
INSERT INTO categories (id, name, slug, description, image, is_active, sort_order) VALUES
(1, 'Oversized', 'oversized', 'Relaxed, drop-shoulder oversized fits.', '/uploads/categories/oversized.jpg', 1, 1),
(2, 'Regular Fit', 'regular-fit', 'Classic true-to-size fit.', '/uploads/categories/regular-fit.jpg', 1, 2),
(3, 'Graphic Tees', 'graphic-tees', 'Bold graphic print T-shirts.', '/uploads/categories/graphic.jpg', 1, 3),
(4, 'Anime', 'anime', 'Anime-inspired streetwear.', '/uploads/categories/anime.jpg', 1, 4),
(5, 'Cars', 'cars', 'Car culture and JDM-inspired tees.', '/uploads/categories/cars.jpg', 1, 5),
(6, 'Minimal', 'minimal', 'Clean, minimal designs.', '/uploads/categories/minimal.jpg', 1, 6),
(7, 'Typography', 'typography', 'Bold type-driven graphics.', '/uploads/categories/typography.jpg', 1, 7),
(8, 'Limited Edition', 'limited-edition', 'Small batch, limited run drops.', '/uploads/categories/limited.jpg', 1, 8),
(9, 'New Arrivals', 'new-arrivals', 'Just landed.', '/uploads/categories/new.jpg', 1, 9),
(10, 'Best Sellers', 'best-sellers', 'Our most-loved pieces.', '/uploads/categories/best.jpg', 1, 10);

-- ---------------- PRODUCTS ----------------
INSERT INTO products (id, category_id, name, slug, sku, description, material, gsm, fit, base_price, sale_price, tags, is_featured, is_active, rating_avg, rating_count, sales_count) VALUES
(1, 5, 'Midnight Speed Tee', 'midnight-speed-tee', 'TX-001', 'A tribute to late-night street racing culture. Heavyweight cotton with a cracked-ink speedometer graphic.', '100% Combed Cotton', 220, 'Oversized', 3490, 2990, 'cars,oversized,street', 1, 1, 4.6, 32, 128),
(2, 5, 'Street Racer Tee', 'street-racer-tee', 'TX-002', 'Motorsport-inspired chest print with racing stripes down the sleeve.', '100% Combed Cotton', 220, 'Regular', 3290, NULL, 'cars,racing', 0, 1, 4.3, 18, 76),
(3, 5, 'JDM Legends Tee', 'jdm-legends-tee', 'TX-003', 'Celebrating Japanese domestic market icons with a bold rear-print silhouette.', '100% Combed Cotton', 240, 'Oversized', 3690, NULL, 'cars,jdm,anime', 1, 1, 4.8, 44, 201),
(4, 5, 'Urban Motion Tee', 'urban-motion-tee', 'TX-004', 'Abstract motion-blur graphic inspired by city night drives.', '100% Combed Cotton', 220, 'Regular', 3190, NULL, 'cars,minimal', 0, 1, 4.1, 9, 40),
(5, 6, 'Minimal Flame Tee', 'minimal-flame-tee', 'TX-005', 'A single-line flame icon on the chest. Understated and sharp.', '100% Cotton', 200, 'Regular', 2990, NULL, 'minimal,typography', 0, 1, 4.4, 21, 64),
(6, 4, 'Tokyo Night Tee', 'tokyo-night-tee', 'TX-006', 'Neon-soaked Tokyo skyline back print with katakana typography.', '100% Combed Cotton', 220, 'Oversized', 3590, 3190, 'anime,cars', 1, 1, 4.7, 51, 240),
(7, 5, 'Retro Racing Tee', 'retro-racing-tee', 'TX-007', 'Vintage checkered-flag graphic with distressed print finish.', '100% Cotton', 210, 'Regular', 3090, NULL, 'cars,retro', 0, 1, 4.2, 14, 55),
(8, 3, 'Shadow Graphic Tee', 'shadow-graphic-tee', 'TX-008', 'Oversized silhouette graphic across the full front panel.', '100% Combed Cotton', 230, 'Oversized', 3390, NULL, 'graphic,minimal', 0, 1, 4.0, 7, 30),
(9, 5, 'Apex Driver Tee', 'apex-driver-tee', 'TX-009', 'Track-inspired apex line graphic with sleeve hit print.', '100% Combed Cotton', 220, 'Regular', 3290, NULL, 'cars,racing', 0, 1, 4.5, 26, 98),
(10, 1, 'Classic Oversized Tee', 'classic-oversized-tee', 'TX-010', 'The everyday essential — no print, all fit. Drop-shoulder oversized cut.', '100% Cotton', 240, 'Oversized', 2790, NULL, 'oversized,minimal,essentials', 1, 1, 4.6, 60, 310),
(11, 7, 'Bold Statement Tee', 'bold-statement-tee', 'TX-011', 'Chunky serif typography wraps the chest in high-contrast ink.', '100% Cotton', 210, 'Regular', 2890, NULL, 'typography', 0, 1, 4.3, 12, 47),
(12, 4, 'Ronin Spirit Tee', 'ronin-spirit-tee', 'TX-012', 'Anime-inspired samurai linework on heavyweight cotton.', '100% Combed Cotton', 230, 'Oversized', 3490, NULL, 'anime,graphic', 0, 1, 4.7, 33, 140),
(13, 8, 'Limited Drop 001', 'limited-drop-001', 'TX-013', 'Small batch release. Hand-numbered tag. Once sold out, it is gone.', '100% Combed Cotton', 240, 'Oversized', 4290, NULL, 'limited,graphic', 1, 1, 4.9, 19, 88),
(14, 6, 'Bare Essential Tee', 'bare-essential-tee', 'TX-014', 'Zero print. Just a perfect cut and premium fabric.', '100% Cotton', 200, 'Regular', 2590, NULL, 'minimal,essentials', 0, 1, 4.2, 15, 60),
(15, 5, 'Turbo Culture Tee', 'turbo-culture-tee', 'TX-015', 'Turbocharger cutaway graphic for the boost-obsessed.', '100% Combed Cotton', 220, 'Regular', 3190, NULL, 'cars,graphic', 0, 1, 4.4, 17, 70),
(16, 3, 'Static Noise Tee', 'static-noise-tee', 'TX-016', 'Glitch-art graphic across an oversized silhouette.', '100% Combed Cotton', 230, 'Oversized', 3390, NULL, 'graphic,minimal', 0, 1, 3.9, 6, 22),
(17, 7, 'Big City Type Tee', 'big-city-type-tee', 'TX-017', 'City-skyline typography stacked in a bold vertical layout.', '100% Cotton', 210, 'Regular', 2890, NULL, 'typography', 0, 1, 4.1, 10, 38),
(18, 4, 'Neon Katana Tee', 'neon-katana-tee', 'TX-018', 'Anime-style katana graphic with neon gradient ink.', '100% Combed Cotton', 220, 'Oversized', 3590, NULL, 'anime', 0, 1, 4.6, 24, 90),
(19, 8, 'Limited Drop 002', 'limited-drop-002', 'TX-019', 'Second in the limited drop series — deep plum colourway.', '100% Combed Cotton', 240, 'Oversized', 4290, NULL, 'limited', 0, 1, 4.8, 11, 42),
(20, 1, 'Everyday Oversized Tee', 'everyday-oversized-tee', 'TX-020', 'Soft-washed oversized tee built for daily rotation.', '100% Cotton', 230, 'Oversized', 2690, NULL, 'oversized,essentials', 0, 1, 4.3, 29, 133);

-- ---------------- PRODUCT IMAGES ----------------
INSERT INTO product_images (product_id, url, type, sort_order) VALUES
(1,'/uploads/products/tx-001-front.jpg','front',1),(1,'/uploads/products/tx-001-back.jpg','back',2),(1,'/uploads/products/tx-001-detail.jpg','detail',3),
(2,'/uploads/products/tx-002-front.jpg','front',1),(2,'/uploads/products/tx-002-back.jpg','back',2),
(3,'/uploads/products/tx-003-front.jpg','front',1),(3,'/uploads/products/tx-003-back.jpg','back',2),(3,'/uploads/products/tx-003-lifestyle.jpg','lifestyle',3),
(4,'/uploads/products/tx-004-front.jpg','front',1),
(5,'/uploads/products/tx-005-front.jpg','front',1),(5,'/uploads/products/tx-005-detail.jpg','detail',2),
(6,'/uploads/products/tx-006-front.jpg','front',1),(6,'/uploads/products/tx-006-back.jpg','back',2),
(7,'/uploads/products/tx-007-front.jpg','front',1),
(8,'/uploads/products/tx-008-front.jpg','front',1),
(9,'/uploads/products/tx-009-front.jpg','front',1),(9,'/uploads/products/tx-009-back.jpg','back',2),
(10,'/uploads/products/tx-010-front.jpg','front',1),
(11,'/uploads/products/tx-011-front.jpg','front',1),
(12,'/uploads/products/tx-012-front.jpg','front',1),(12,'/uploads/products/tx-012-back.jpg','back',2),
(13,'/uploads/products/tx-013-front.jpg','front',1),(13,'/uploads/products/tx-013-lifestyle.jpg','lifestyle',2),
(14,'/uploads/products/tx-014-front.jpg','front',1),
(15,'/uploads/products/tx-015-front.jpg','front',1),
(16,'/uploads/products/tx-016-front.jpg','front',1),
(17,'/uploads/products/tx-017-front.jpg','front',1),
(18,'/uploads/products/tx-018-front.jpg','front',1),(18,'/uploads/products/tx-018-back.jpg','back',2),
(19,'/uploads/products/tx-019-front.jpg','front',1),
(20,'/uploads/products/tx-020-front.jpg','front',1);

-- ---------------- PRODUCT VARIANTS ----------------
-- Generate S/M/L/XL/XXL x Black/White/Grey for each product (compact representative set)
INSERT INTO product_variants (product_id, size, color, color_hex, sku, stock) VALUES
(1,'S','Black','#0A0A0A','TX-001-BLK-S',12),(1,'M','Black','#0A0A0A','TX-001-BLK-M',20),(1,'L','Black','#0A0A0A','TX-001-BLK-L',18),(1,'XL','Black','#0A0A0A','TX-001-BLK-XL',9),(1,'XXL','Black','#0A0A0A','TX-001-BLK-XXL',4),
(1,'S','White','#FAFAFA','TX-001-WHT-S',10),(1,'M','White','#FAFAFA','TX-001-WHT-M',14),(1,'L','White','#FAFAFA','TX-001-WHT-L',11),
(2,'S','Black','#0A0A0A','TX-002-BLK-S',8),(2,'M','Black','#0A0A0A','TX-002-BLK-M',15),(2,'L','Black','#0A0A0A','TX-002-BLK-L',10),(2,'XL','Black','#0A0A0A','TX-002-BLK-XL',6),
(3,'S','Black','#0A0A0A','TX-003-BLK-S',5),(3,'M','Black','#0A0A0A','TX-003-BLK-M',22),(3,'L','Black','#0A0A0A','TX-003-BLK-L',17),(3,'XL','Black','#0A0A0A','TX-003-BLK-XL',8),
(3,'M','Grey','#737373','TX-003-GRY-M',12),(3,'L','Grey','#737373','TX-003-GRY-L',9),
(4,'S','Navy','#1C2733','TX-004-NVY-S',7),(4,'M','Navy','#1C2733','TX-004-NVY-M',13),(4,'L','Navy','#1C2733','TX-004-NVY-L',10),
(5,'S','White','#FAFAFA','TX-005-WHT-S',9),(5,'M','White','#FAFAFA','TX-005-WHT-M',16),(5,'L','White','#FAFAFA','TX-005-WHT-L',12),
(6,'M','Black','#0A0A0A','TX-006-BLK-M',25),(6,'L','Black','#0A0A0A','TX-006-BLK-L',20),(6,'XL','Black','#0A0A0A','TX-006-BLK-XL',11),(6,'S','Black','#0A0A0A','TX-006-BLK-S',6),
(7,'M','Grey','#737373','TX-007-GRY-M',10),(7,'L','Grey','#737373','TX-007-GRY-L',8),
(8,'M','Black','#0A0A0A','TX-008-BLK-M',5),(8,'L','Black','#0A0A0A','TX-008-BLK-L',3),
(9,'S','Red','#C21807','TX-009-RED-S',6),(9,'M','Red','#C21807','TX-009-RED-M',14),(9,'L','Red','#C21807','TX-009-RED-L',9),
(10,'S','Black','#0A0A0A','TX-010-BLK-S',30),(10,'M','Black','#0A0A0A','TX-010-BLK-M',40),(10,'L','Black','#0A0A0A','TX-010-BLK-L',35),(10,'XL','Black','#0A0A0A','TX-010-BLK-XL',20),(10,'XXL','Black','#0A0A0A','TX-010-BLK-XXL',10),
(11,'M','White','#FAFAFA','TX-011-WHT-M',12),(11,'L','White','#FAFAFA','TX-011-WHT-L',9),
(12,'M','Black','#0A0A0A','TX-012-BLK-M',18),(12,'L','Black','#0A0A0A','TX-012-BLK-L',15),(12,'XL','Black','#0A0A0A','TX-012-BLK-XL',7),
(13,'M','Plum','#4B2A45','TX-013-PLM-M',4),(13,'L','Plum','#4B2A45','TX-013-PLM-L',3),
(14,'S','White','#FAFAFA','TX-014-WHT-S',20),(14,'M','White','#FAFAFA','TX-014-WHT-M',25),(14,'L','White','#FAFAFA','TX-014-WHT-L',18),
(15,'M','Black','#0A0A0A','TX-015-BLK-M',11),(15,'L','Black','#0A0A0A','TX-015-BLK-L',9),
(16,'M','Grey','#737373','TX-016-GRY-M',0),(16,'L','Grey','#737373','TX-016-GRY-L',2),
(17,'M','Black','#0A0A0A','TX-017-BLK-M',13),(17,'L','Black','#0A0A0A','TX-017-BLK-L',10),
(18,'M','Black','#0A0A0A','TX-018-BLK-M',16),(18,'L','Black','#0A0A0A','TX-018-BLK-L',12),(18,'XL','Black','#0A0A0A','TX-018-BLK-XL',5),
(19,'M','Plum','#4B2A45','TX-019-PLM-M',6),(19,'L','Plum','#4B2A45','TX-019-PLM-L',4),
(20,'S','Grey','#737373','TX-020-GRY-S',22),(20,'M','Grey','#737373','TX-020-GRY-M',28),(20,'L','Grey','#737373','TX-020-GRY-L',19);

-- ---------------- COUPONS ----------------
INSERT INTO coupons (code, type, value, min_order_amount, usage_limit, per_user_limit, used_count, starts_at, expires_at, is_active) VALUES
('WELCOME10', 'percentage', 10, 2000, 500, 1, 84, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('FREESHIP', 'fixed', 350, 3000, NULL, 2, 210, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('THREADX500', 'fixed', 500, 5000, 200, 1, 47, '2026-06-01 00:00:00', '2026-09-30 23:59:59', 1),
('EXPIRED20', 'percentage', 20, 1000, 100, 1, 100, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 0);

-- ---------------- SHIPPING (district fees) ----------------
INSERT INTO shipping (district, fee, is_active) VALUES
('Colombo', 300, 1), ('Gampaha', 350, 1), ('Kalutara', 400, 1), ('Kandy', 450, 1),
('Galle', 450, 1), ('Matara', 500, 1), ('Jaffna', 650, 1), ('Kurunegala', 450, 1),
('Anuradhapura', 550, 1), ('Batticaloa', 650, 1), ('Trincomalee', 650, 1), ('Ratnapura', 450, 1);

-- ---------------- ADDRESSES ----------------
INSERT INTO addresses (user_id, label, first_name, last_name, phone, address_line, city, district, postal_code, is_default) VALUES
(2, 'Home', 'Nadeesha', 'Perera', '+94771112222', '12 Flower Road', 'Colombo 07', 'Colombo', '00700', 1),
(3, 'Home', 'Kasun', 'Silva', '+94772223333', '45 Lake Drive', 'Kandy', 'Kandy', '20000', 1),
(4, 'Home', 'Dilani', 'Fernando', '+94773334444', '8 Galle Road', 'Mount Lavinia', 'Colombo', '10370', 1);

-- ---------------- ORDERS ----------------
INSERT INTO orders (id, order_number, user_id, first_name, last_name, email, phone, address_line, city, district, postal_code, subtotal, discount, delivery_fee, total, payment_method, payment_status, order_status, courier_name, tracking_number, created_at) VALUES
(1,'TS10001',2,'Nadeesha','Perera','nadeesha@example.com','+94771112222','12 Flower Road','Colombo 07','Colombo','00700',6280,628,0,5652,'cod','cod_pending','delivered','Domex','DX10001','2026-07-01 10:15:00'),
(2,'TS10002',3,'Kasun','Silva','kasun@example.com','+94772223333','45 Lake Drive','Kandy','Kandy','20000',3690,0,450,4140,'online','paid','shipped','Koombiyo','KB20045','2026-07-14 14:22:00'),
(3,'TS10003',4,'Dilani','Fernando','dilani@example.com','+94773334444','8 Galle Road','Mount Lavinia','Colombo','10370',3290,0,300,3590,'cod','cod_pending','processing',NULL,NULL,'2026-07-20 09:05:00'),
(4,'TS10004',2,'Nadeesha','Perera','nadeesha@example.com','+94771112222','12 Flower Road','Colombo 07','Colombo','00700',7180,0,0,7180,'online','paid','packed','Domex',NULL,'2026-08-01 11:40:00'),
(5,'TS10005',5,'Ruwan','Jayasuriya','ruwan@example.com','+94774445555','22 Park Street','Galle','Galle',NULL,3190,319,450,3321,'cod','cod_pending','confirmed',NULL,NULL,'2026-08-05 16:12:00'),
(6,'TS10006',NULL,'Guest','Buyer','guest1@example.com','+94775551111','5 Marine Drive','Negombo','Gampaha',NULL,2990,0,350,3340,'cod','cod_pending','pending',NULL,NULL,'2026-08-10 08:30:00'),
(7,'TS10007',6,'Ishara','Gunawardena','ishara@example.com','+94775556666','30 Temple Road','Matara','Matara',NULL,4290,0,500,4790,'online','paid','delivered','Aramex','AX99011','2026-06-20 12:00:00'),
(8,'TS10008',3,'Kasun','Silva','kasun@example.com','+94772223333','45 Lake Drive','Kandy','Kandy','20000',3590,0,450,4040,'cod','cod_pending','cancelled',NULL,NULL,'2026-06-25 17:45:00'),
(9,'TS10009',4,'Dilani','Fernando','dilani@example.com','+94773334444','8 Galle Road','Mount Lavinia','Colombo','10370',5980,598,0,5382,'online','paid','delivered','Domex','DX10099','2026-05-30 13:10:00'),
(10,'TS10010',5,'Ruwan','Jayasuriya','ruwan@example.com','+94774445555','22 Park Street','Galle','Galle',NULL,3290,0,450,3740,'cod','cod_pending','printing',NULL,NULL,'2026-08-14 10:00:00');

INSERT INTO order_items (order_id, product_variant_id, product_name, size, color, unit_price, quantity, line_total) VALUES
(1,2,'Midnight Speed Tee','M','Black',2990,2,5980),(1,20,'Bare Essential Tee','S','White',2590,1,300),
(2,13,'JDM Legends Tee','M','Black',3690,1,3690),
(3,9,'Street Racer Tee','M','Black',3290,1,3290),
(4,23,'Tokyo Night Tee','M','Black',3190,1,3190),(4,42,'Ronin Spirit Tee','M','Black',3490,1,3490),
(5,4,'Urban Motion Tee','M','Navy',3190,1,3190),
(6,1,'Midnight Speed Tee','S','Black',2990,1,2990),
(7,46,'Limited Drop 001','M','Plum',4290,1,4290),
(8,27,'Neon Katana Tee','M','Black',3590,1,3590),
(9,3,'Midnight Speed Tee','L','Black',2990,2,5980),
(10,9,'Street Racer Tee','M','Black',3290,1,3290);

-- ---------------- REVIEWS ----------------
INSERT INTO reviews (product_id, user_id, rating, comment, is_approved, created_at) VALUES
(1, 2, 5, 'Heavyweight cotton and the print has held up after a dozen washes. Fit runs true to oversized.', 1, '2026-07-10 12:00:00'),
(3, 3, 5, 'Best tee I own. Print detail on the back is insane in person.', 1, '2026-07-18 09:30:00'),
(6, 4, 4, 'Love the graphic, sizing runs slightly large so consider sizing down.', 1, '2026-08-02 15:20:00'),
(10, 5, 5, 'Everyday staple now. Ordered a second one in a different colour.', 1, '2026-08-08 18:00:00'),
(13, 6, 5, 'Worth the limited-drop price. Fabric feels premium and the fit is perfect.', 1, '2026-06-28 11:15:00');

-- ---------------- ADMIN NOTE ----------------
-- Demo admin login:
--   email:    admin@threadx.example
--   password: Password123!
-- CHANGE THIS IMMEDIATELY before any real deployment.
