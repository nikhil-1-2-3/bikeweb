-- Booking Database Initialization
CREATE DATABASE booking_db;

\c booking_db;

CREATE TABLE IF NOT EXISTS appointments (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER       NOT NULL,
  bike_id          INTEGER       NOT NULL,
  appointment_type VARCHAR(50)   NOT NULL CHECK (appointment_type IN ('showroom_visit', 'test_ride')),
  appointment_date DATE          NOT NULL,
  appointment_time TIME          NOT NULL,
  customer_name    VARCHAR(100)  NOT NULL,
  customer_phone   VARCHAR(20)   NOT NULL,
  status           VARCHAR(30)   DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed','rejected')),
  notes            TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date     ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status   ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_bike     ON appointments(bike_id);
