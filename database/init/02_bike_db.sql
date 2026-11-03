-- Bike Database Initialization
CREATE DATABASE bike_db;

\c bike_db;

CREATE TABLE IF NOT EXISTS motorcycles (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  brand            VARCHAR(100) NOT NULL,
  model            VARCHAR(100) NOT NULL,
  description      TEXT,
  price            NUMERIC(12,2) NOT NULL,
  engine_capacity  VARCHAR(50),
  mileage          VARCHAR(50),
  fuel_type        VARCHAR(50)  DEFAULT 'Petrol',
  transmission     VARCHAR(50)  DEFAULT 'Manual',
  image_url        TEXT,
  availability     BOOLEAN      DEFAULT true,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_motorcycles_brand        ON motorcycles(brand);
CREATE INDEX IF NOT EXISTS idx_motorcycles_availability ON motorcycles(availability);
CREATE INDEX IF NOT EXISTS idx_motorcycles_price        ON motorcycles(price);

-- Seed motorcycles
INSERT INTO motorcycles (name, brand, model, description, price, engine_capacity, mileage, fuel_type, transmission, image_url, availability) VALUES

('Sportster S', 'Harley-Davidson', 'RH1250S', 'The Sportster S is a revolution in performance and style. Powered by the liquid-cooled Revolution Max 1250T engine, it delivers 121 horsepower with cutting-edge ride dynamics and a low-slung, aggressive stance.', 15999.00, '1252cc', '18 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true),

('Iron 883', 'Harley-Davidson', 'XL883N', 'Raw, blacked-out attitude meets classic American muscle. The Iron 883 is the ultimate modern bobber — minimal chrome, maximum attitude, built for those who want a pure street machine.', 9999.00, '883cc', '22 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=800', true),

('Classic 350', 'Royal Enfield', 'J Series', 'Timeless. Iconic. The Classic 350 has defined the middleweight segment for decades. With its distinctive thump and vintage silhouette, it embodies the spirit of pure motorcycling.', 2499.00, '349cc', '37 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', true),

('Meteor 350', 'Royal Enfield', 'Fireball', 'Born for the open road. The Meteor 350 combines a relaxed cruiser stance with modern engineering. Its low-slung design and smooth engine make every journey a pleasure.', 2799.00, '349cc', '36 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true),

('Speed Twin 900', 'Triumph', 'T900', 'The Speed Twin 900 is the perfect blend of classic Triumph heritage and contemporary performance. The parallel twin engine delivers punchy midrange torque with a soundtrack that turns heads.', 12499.00, '900cc', '20 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800', true),

('Bonneville T120', 'Triumph', 'T120', 'An icon reimagined. The Bonneville T120 is the pinnacle of classic British motorcycle design — updated with modern fuel injection, traction control, and ride-by-wire for the contemporary rider.', 13499.00, '1200cc', '19 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', true),

('Scout Bobber', 'Indian', 'Scout Bobber', 'American muscle with a dark soul. The Scout Bobber strips the legendary Indian Scout down to its essence — low-rise handlebars, blacked-out details, and a thundering 1133cc V-twin engine.', 14299.00, '1133cc', '19 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', true),

('R 1250 GS', 'BMW', 'R 1250 GS', 'The benchmark adventure tourer. The R 1250 GS combines BMW''s legendary boxer engine with cutting-edge electronics and suspension to conquer any terrain. From city streets to mountain passes.', 18999.00, '1254cc', '17 kmpl', 'Petrol', 'Manual', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true);
