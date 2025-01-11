# InsurancePolicy
Simple Insurance Policy Management System

# Getting Started

This guide explains how to set up and run the application in three different environments: **Production**, **Local**, and **Development**.

---

## Prerequisites

### Common Requirements for All Environments
- **Docker** installed on your machine.

### Additional Requirements for Development
- **Node.js** and **Angular CLI** installed.
- An IDE like Visual Studio Code or Rider to run the .NET API.
- **.NET SDK** installed.

---

## Deployment Scenarios

#### Quick Setup
These 2 instructions will get your app up and running locally.
1. [Do DB Migrations](#prod-and-local-database-migrations)
2. [Follow local guide](#local)

---

### Production

The production setup can be fully Dockerized or partially Dockerized with the Angular client deployed through an external service.

#### Fully Dockerized Setup:
1. **Run the Application:**
   ```bash
   docker compose up -d
   ```

2. **Access the Application:**
   - **App:** Your host mapped to [http://localhost:8080](http://localhost:8080)
   - **pgAdmin:** Your host mapped to [http://localhost:8888](http://localhost:8888)
      - Use `postgres` as the host when connecting to the database.

#### Partially Dockerized Setup:
1. **Run the API and Database:**
   Navigate to the API folder and run:
   ```bash
   docker compose up -d
   ```

2. **Deploy the Angular Client:**
   Deploy the Angular build files to a service like AWS Amplify, which uses S3 and CloudFront for hosting.

3. **Access the Application:**
   - **App:** Accessible via the Amplify-provided URL.
   - **pgAdmin:** Your host mapped to [http://localhost:8888](http://localhost:8888)
      - Use `postgres` as the host when connecting to the database.

---

### Local

The local setup is similar to the fully Dockerized production setup but uses a different build configuration.

#### Steps:
1. **Build the Docker Image with Local Configuration:**
   ```bash
   DEPLOY_LOCAL=true docker compose up -d
   ```

2. **Access the Application:**
   - **App:** [http://localhost:8080](http://localhost:8080)
   - **pgAdmin:** [http://localhost:8888](http://localhost:8888)
      - Use `postgres` as the host when connecting to the database.

---

### PROD And LOCAL Database Migrations
Run Database Migrations:
While in the root project directory, run migrations with:
```bash
docker compose run --rm ef-migrate dotnet ef database update -- --environment Production
```

---

### Development

The development setup involves running services through Docker Compose and running the code locally.

#### Steps:
1. **Start the Database and pgAdmin:**
   Run the following command in the API folder:
   ```bash
   docker compose -f docker-compose-dev.yml up -d
   ```

   - **pgAdmin:** Accessible at [http://localhost:8889](http://localhost:8889).
   - **Database Connection Info:**
      - Host: `localhost`
      - Port: `5432`

2. **Run the API:**
   Use your IDE or the .NET CLI to start the API:
   ```bash
   dotnet run
   ```
   The API will handle migrations automatically when it starts.

3. **Run the Angular Client:**
   Navigate to the Angular project folder and run:
   ```bash
   npm install
   ng serve
   ```

   - The app will be accessible at [http://localhost:4200](http://localhost:4200).

---

## Environment Variables

The application uses the following environment variables for the database setup:

| Variable                   | Default Value             | Description                         |
|----------------------------|---------------------------|-------------------------------------|
| `POSTGRES_USER`            | `insured`                 | The username for the database.      |
| `POSTGRES_PASSWORD`        | `iP@2025`                 | The password for the database user. |
| `PGADMIN_DEFAULT_EMAIL`    | `admin@joshuaondieki.com` | The email for the pgadmin.          |
| `PGADMIN_DEFAULT_PASSWORD` | `a@dmIn3..`               | The password for pgadmin.           |
| `POSTGRES_DB`              | `insurancedb`             | The name of the database.           |

**Note:** These values can be overridden in the `docker-compose` file or by setting them in your environment.

---

## Summary

| Environment        | Access App            | Access pgAdmin        | Database Host                 | Notes                                             |
|--------------------|-----------------------|-----------------------|-------------------------------|---------------------------------------------------|
| **Prod (Docker)**  | Prod URL              | Prod URL              | `postgres` (via pgAdmin only) | Fully Dockerized setup.                           |
| **Prod (Hybrid)**  | Amplify URL           | http://localhost:8888 | `postgres` (via pgAdmin only) | API & DB in Docker; Angular on S3/CloudFront.     |
| **Local**          | http://localhost:8080 | http://localhost:8888 | `postgres` (via pgAdmin only) | Similar to prod but with `DEPLOY_LOCAL=true`.     |
| **Dev**            | http://localhost:4200 | http://localhost:8889 | `localhost:5432`              | DB & pgAdmin in Docker, API & client run locally. |

---
