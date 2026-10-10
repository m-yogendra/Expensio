# MyTracker Backend

Spring Boot backend for MyTracker expense tracking.

## Tech Stack
- Java 17
- Spring Boot (Maven)
- Spring Data JPA
- MySQL

## Folder Structure
- `src/main/java/com/mytracker/backend/entity` -> JPA entities
- `src/main/java/com/mytracker/backend/repository` -> repositories
- `src/main/java/com/mytracker/backend/service` -> business logic
- `src/main/java/com/mytracker/backend/controller` -> REST APIs
- `src/main/resources/application.properties` -> database + app config

## API Endpoints
- `POST /api/expenses` -> add expense
- `GET /api/expenses` -> list all expenses (latest first)
- `DELETE /api/expenses/{id}` -> delete expense by id

## Database Config
Configured in `src/main/resources/application.properties`:
- host: `127.0.0.1`
- port: `3306`
- database: `MyTracker`
- username: `root` (or set via `DB_USER` env var)
- password: Set via `DB_PASSWORD` env var

See `application-example.properties` for configuration template.

## Run Backend
From project root:

```powershell
mvn -f backend/pom.xml spring-boot:run
```

Or from backend folder:

```powershell
cd backend
mvn spring-boot:run
```

Default server port: `8080`

## Quick API Test
```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8080/api/expenses | Select-Object -ExpandProperty Content
```
