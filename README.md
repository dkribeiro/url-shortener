# URL Shortener

A URL shortener application with a NestJS backend and React frontend.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Start the services:
```bash
docker compose up -d
```

## Services and Ports

The following services are available at these ports:

- Frontend: http://localhost:3457 (React application)
- API: http://localhost:3456/docs (Swagger for the NestJS backend)
- PostgreSQL: localhost:3458
- Redis: localhost:3459
- Redis Commander: http://localhost:3460 (Redis management interface)

## Development

The application is set up with hot-reload for both frontend and backend:

- Frontend changes will be reflected immediately in the browser
- Backend changes will trigger automatic rebuilds

## Environment Variables

The following environment variables are available:

### Frontend
- `VITE_API_URL`: URL of the API service (automatically set in Docker)

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `MAX_RETRIES`: Maximum number of retries for database operations
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port

## Stopping the Services

To stop all services:
```bash
docker compose down
```

To stop and remove volumes:
```bash
docker compose down -v
```
