
# Hotel Offer Orchestrator

A backend service built with Node.js, TypeScript, Express, Temporal, and Redis that aggregates hotel offers from multiple suppliers, selects the cheapest available offer, and provides price-based filtering.

## Overview

Hotel Offer Orchestrator fetches hotel data from two independent suppliers concurrently, compares their prices, removes duplicate hotel entries, and returns the best available offers.

The processed results are cached in Redis to reduce repeated supplier API calls and improve response time.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Express.js | REST API development |
| Temporal | Workflow orchestration |
| Redis | Caching and price filtering |
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |

## Key Features

- Parallel hotel data fetching from multiple suppliers.
- Temporal workflows and activities for reliable orchestration.
- Hotel deduplication based on normalized hotel names.
- Automatic selection of the cheapest supplier offer.
- Preservation of the selected supplier's commission percentage.
- Redis-based caching with city-specific keys.
- Price-range filtering performed directly inside Redis.
- One-hour cache expiration.
- Dockerized application setup.

## Architecture

```text
                 Client
                   |
                   v
             Express API
                   |
                   v
              Redis Cache
                   |
          Cache Hit / Cache Miss
                   |
             Cache Miss
                   |
                   v
           Temporal Workflow
                   |
             Parallel Calls
              /          \
             v            v
        Supplier A    Supplier B
             \            /
              \          /
               v        v
            Compare Offers
                   |
             Deduplicate
                   |
                   v
               Redis
                   |
             Price Filtering
                   |
                   v
             API Response
```

## Project Structure

```text
Triphoria-Assignment/
│
├── src/
│   ├── activities/
│   │   └── hotel.activities.ts
│   │
│   ├── config/
│   │   ├── redis.ts
│   │   └── temporal.ts
│   │
│   ├── routes/
│   │   ├── hotel.routes.ts
│   │   └── supplier.routes.ts
│   │
│   ├── services/
│   │   ├── hotel.service.ts
│   │   └── redis.service.ts
│   │
│   ├── suppliers/
│   │   └── mockData.ts
│   │
│   ├── workers/
│   │   └── hotel.worker.ts
│   │
│   ├── workflows/
│   │   ├── hotel.workflow.ts
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. The client sends a request to the hotel API with a city parameter.
2. The API checks Redis for previously processed hotel offers.
3. If cached data exists, Redis returns the requested price range directly.
4. If there is no cached data, the API starts a Temporal workflow.
5. The Temporal worker executes Supplier A and Supplier B activities concurrently.
6. The comparison activity merges the supplier responses and selects the cheapest offer for each hotel.
7. The deduplicated results are stored in Redis.
8. Redis performs price filtering using sorted-set operations.
9. The API returns the final hotel offers.

## API Endpoints

Base URL:

```text
http://localhost:3000
```

### 1. Get All Hotel Offers

```http
GET /api/hotels?city=delhi
```

Returns all deduplicated hotel offers for Delhi.

### 2. Filter by Maximum Price

```http
GET /api/hotels?city=delhi&maxPrice=10000
```

Returns hotels costing up to ₹10,000.

### 3. Filter by Price Range

```http
GET /api/hotels?city=delhi&minPrice=5500&maxPrice=12000
```

Returns hotels within the specified price range.

### 4. Supplier A Mock API

```http
GET /supplierA/hotels?city=delhi
```

### 5. Supplier B Mock API

```http
GET /supplierB/hotels?city=delhi
```

### 6. Health Check

```http
GET /health
```

## Sample Response

```json
[
  {
    "name": "Holtin",
    "price": 5340,
    "supplier": "Supplier B",
    "commissionPct": 20
  },
  {
    "name": "Radison",
    "price": 5900,
    "supplier": "Supplier A",
    "commissionPct": 13
  },
  {
    "name": "Taj",
    "price": 12000,
    "supplier": "Supplier A",
    "commissionPct": 15
  },
  {
    "name": "The Leela",
    "price": 15000,
    "supplier": "Supplier A",
    "commissionPct": 12
  },
  {
    "name": "Hyatt",
    "price": 9000,
    "supplier": "Supplier B",
    "commissionPct": 18
  },
  {
    "name": "The Oberoi",
    "price": 18000,
    "supplier": "Supplier B",
    "commissionPct": 15
  }
]
```

## Redis Implementation

Redis Sorted Sets are used to store hotel offers.

Each city has a separate key:

```text
hotels:delhi
```

Each hotel offer is stored as a JSON string, with its price used as the sorted-set score.

Price filtering is performed using:

```text
ZRANGEBYSCORE
```

The cache expires after 3600 seconds (one hour).

## Temporal Workflow

**Workflow:** `hotelOfferWorkflow`

**Task Queue:** `hotel-task-queue`

The workflow executes three activities:

1. `fetchSupplierAHotels` – Fetches offers from Supplier A.
2. `fetchSupplierBHotels` – Fetches offers from Supplier B.
3. `compareOffers` – Compares and deduplicates the results.

Both supplier-fetching activities are executed concurrently using `Promise.all()`.

Temporal activity retry policies are configured to retry failed activities.

## Running the Project

### Prerequisites

- Docker Desktop
- Git

### Run Using Docker Compose

Clone the repository:

```bash
git clone https://github.com/yashyvs/Triphoria-Assignment.git
```

Navigate into the project:

```bash
cd Triphoria-Assignment
```

Build and start all services:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f api worker
```

Stop all services:

```bash
docker compose down
```

## Service URLs

| Service | URL |
|---|---|
| Hotel API | http://localhost:3000 |
| Health Check | http://localhost:3000/health |
| Temporal UI | http://localhost:8233 |
| Redis | localhost:6379 |
| Temporal Server | localhost:7233 |

## Environment Variables

For local development, create a `.env` file using `.env.example` as a reference.

```env
PORT=3000
TEMPORAL_ADDRESS=localhost:7233
SUPPLIER_API_BASE_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

Docker Compose supplies container-specific environment variables to the API and worker.

## Testing

The API can be tested using Postman.

Recommended test cases:

- Fetch all hotels for Delhi.
- Fetch hotels with a maximum price.
- Fetch hotels within a minimum and maximum price.
- Verify duplicate hotels are removed.
- Verify the cheapest supplier is selected.
- Verify results are stored in Redis.
- Verify repeated requests use cached results.
- Test missing city and invalid price ranges.