# THE MOTOR HOUSE

> Premium motorcycle showroom and appointment booking platform.

---

## Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios     |
| Gateway    | Node.js, Express (Port 4000)            |
| Auth       | Node.js, Express, JWT, bcrypt (Port 4001) |
| Bikes      | Node.js, Express, PostgreSQL (Port 4002)  |
| Bookings   | Node.js, Express, PostgreSQL (Port 4003)  |
| Database   | PostgreSQL 15 — raw `pg`, no ORM        |
| Container  | Docker + Docker Compose                 |

---

## Quick Start (Docker)

```bash
# 1. Copy env file
cp .env.example .env

# 2. Start everything
docker compose up -d --build

# 3. Open in browser
http://localhost:3000
```

All four PostgreSQL databases (`auth_db`, `bike_db`, `booking_db`) are created automatically from `/database/init/` scripts on first boot.

---

## Running Services Individually (Local Dev)

Requires PostgreSQL running locally with the init scripts applied.

```bash
# Apply DB schemas first
psql -U postgres -f database/init/01_auth_db.sql
psql -U postgres -f database/init/02_bike_db.sql
psql -U postgres -f database/init/03_booking_db.sql

# Auth Service
cd backend/auth-service && npm install && npm start

# Bike Service
cd backend/bike-service && npm install && npm start

# Booking Service
cd backend/booking-service && npm install && npm start

# API Gateway
cd backend/api-gateway && npm install && npm start

# Frontend
cd frontend && npm install && npm run dev
```

---

## Default Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@motorhouse.com     | Admin@123  |

---

## API Reference

### Authentication (via Gateway → :4000/api/auth)
| Method | Path                | Auth     | Description          |
|--------|---------------------|----------|----------------------|
| POST   | /api/auth/register  | —        | Register customer     |
| POST   | /api/auth/login     | —        | Login                 |
| GET    | /api/auth/profile   | Customer | Get own profile       |
| PUT    | /api/auth/profile   | Customer | Update profile        |
| GET    | /api/auth/users     | Admin    | List all users        |
| GET    | /api/auth/users/:id | Admin    | Get user by ID        |

### Motorcycles (via Gateway → :4000/api/bikes)
| Method | Path                       | Auth  | Description           |
|--------|----------------------------|-------|-----------------------|
| GET    | /api/bikes                 | —     | List all bikes        |
| GET    | /api/bikes/:id             | —     | Get bike details      |
| POST   | /api/bikes                 | Admin | Create bike           |
| PUT    | /api/bikes/:id             | Admin | Update bike           |
| DELETE | /api/bikes/:id             | Admin | Delete bike           |
| PATCH  | /api/bikes/:id/availability | Admin | Toggle availability  |

### Appointments (via Gateway → :4000/api/appointments)
| Method | Path                       | Auth     | Description              |
|--------|----------------------------|----------|--------------------------|
| POST   | /api/appointments          | Customer | Book appointment         |
| GET    | /api/appointments/my       | Customer | My appointments          |
| GET    | /api/appointments          | Admin    | All appointments         |
| GET    | /api/appointments/:id      | Auth     | Get by ID                |
| PATCH  | /api/appointments/:id/cancel | Customer | Cancel appointment     |
| PATCH  | /api/appointments/:id/status | Admin  | Update status            |

---

## Color Palette

| Name         | Hex       |
|--------------|-----------|
| Cream        | `#F3E9D8` |
| Cherry Red   | `#A52A3A` |
| Burgundy     | `#762C31` |
| Charcoal     | `#292624` |
| Antique Gold | `#B99B76` |
| Warm White   | `#FFFDF8` |

---

## Service Ports

| Service         | Port |
|-----------------|------|
| Frontend        | 3000 |
| API Gateway     | 4000 |
| Auth Service    | 4001 |
| Bike Service    | 4002 |
| Booking Service | 4003 |
| PostgreSQL      | 5432 |
