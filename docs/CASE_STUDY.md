# Case Study: Containerizing & Orchestrating a Three-Tier BookStore Application

## 1. Problem & Context
The baseline SEG3502 BookStore application consists of an Angular 18 single-page application (`bookstore-client`), a Kotlin/Spring Boot HATEOAS REST API (`books-rest-api`), and a MySQL database. Running these components directly on developer machines introduces drift in JDK/Node versions, hardcoded localhost URLs in compiled frontend assets, and manual startup ordering against MySQL.

## 2. Architectural Decisions

### 2.1 Multi-Stage Docker Builds
- **Backend (`books-rest-api/Dockerfile`):** Separates compilation (`gradle:jdk21-alpine` running `./gradlew bootJar --no-daemon`) from runtime (`eclipse-temurin:21-jdk-alpine` executing `/app/app.jar`), avoiding shipping the Gradle wrapper cache and source tree in the runtime layer.
- **Frontend (`bookstore-client/Dockerfile`):** Compiles the Angular production bundle on `node:20-alpine` (`npm run build --prod`) and copies static artifacts into a lightweight `nginx:alpine` image with `gettext` (`envsubst`).

### 2.2 Runtime Environment Injection for Angular SPA
- Single-page applications execute in the user's browser, so container environment variables are not directly visible at runtime.
- Instead of baking `API_URL` at `ng build` time (which would require rebuilding the image per environment), `bookstore-client/entrypoint.sh` executes `envsubst < /usr/share/nginx/html/assets/env.template.json > /usr/share/nginx/html/assets/env.json` before `exec nginx -g 'daemon off;'`.
- `BooksService` reads `window['env'].apiUrl`, decoupling image build from deployment topology (Docker standalone, Docker Compose, Kubernetes).

### 2.3 Service Dependency & Persistence Design
- **Docker Compose (`docker/docker-compose.yml`):** Defines a `mysql` healthcheck (`SHOW DATABASES;`) and gates `booksserver` via `depends_on.mysql.condition: service_healthy` so Spring Data JPA does not fail on cold MySQL initialization. Database state persists across container restarts via the named volume `mysql-data`.
- **Host-Network Fallback (`docker/docker-compose.hostnet.yml`):** Provides a composable override (`networks: !reset []`, `network_mode: host`, `extra_hosts: ["mysql:127.0.0.1"]`) for constrained Linux kernels lacking `iptables` bridge NAT.
- **Kubernetes (`k8s/`):**
  - `mysql-volume.yaml` pairs a `100Mi` `PersistentVolume` (`hostPath: /mnt/data`) with a matching `PersistentVolumeClaim`.
  - `mysql-deployment.yaml` uses a headless `Service` (`clusterIP: None`) and `strategy.type: Recreate` so only one MySQL pod mounts the `ReadWriteOnce` volume at a time.
  - `booksserver-deployment.yaml` and `booksclient-deployment.yaml` run `replicas: 2` behind `ClusterIP` services with `lifecycle.preStop` (`sleep 5`) to allow in-flight connections to drain during pod termination.

### 2.4 Security & Production Hardening Notes
- Lab manifests use explicit demo credentials (`MYSQL_ROOT_PASSWORD=root`) and `CrossOrigin(origins = ["http://localhost:4200"])` matching the academic lab setup; as noted in `k8s/mysql-deployment.yaml` (`# Use secret in real usage`), production deployments should inject database credentials via Kubernetes `Secret`s / sealed secrets and expose `booksapp` / `booksserver` via an `Ingress` controller so the browser does not rely on `localhost` port-forwarding.
