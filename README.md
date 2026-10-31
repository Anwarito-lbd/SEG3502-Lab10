# SEG3502 — Laboratoire 10 — Conteneurs (Docker, Docker Compose, Kubernetes)

Étudiants : Anwar (300254189), Manasse (300268472)

Conteneurisation de l'application BookStore du laboratoire 7 :

| Dossier | Contenu |
|---|---|
| `books-rest-api/` | API Spring Boot + `Dockerfile` (variables `MYSQL_HOST`, `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD`) |
| `bookstore-client/` | Client Angular + `Dockerfile` (nginx), `entrypoint.sh`, `src/assets/env.template.json` (variable `API_URL`) |
| `docker/docker-compose.yml` | Services `mysql`, `booksserver`, `booksapp` |
| `k8s/` | Déploiements/services Kubernetes (`mysql`, `booksserver` ×2, `booksapp` ×2) + volume persistant |

Prérequis : Docker Desktop (avec Kubernetes activé) ou Docker + minikube/kind, et `kubectl`.

## 1. Docker (Q1, Q2)

```bash
git clone https://github.com/Anwarito-lbd/SEG3502-Lab10.git
cd SEG3502-Lab10
docker build -t books-rest-api:latest books-rest-api
docker build -t books-api-client:latest bookstore-client
docker network create mysql-network
docker container run -d --network mysql-network --name mysqldb \
  -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=booksDb mysql:9
docker container run -d --network mysql-network --name booksserver -p 8080:8080 \
  -e MYSQL_USER=root -e MYSQL_PASSWORD=root -e MYSQL_DB=booksDb -e MYSQL_HOST=mysqldb books-rest-api:latest
docker container ls                                    # Q1
docker container run -d --name booksclient -p 4100:80 \
  -e API_URL=http://localhost:8080/books-api/ books-api-client:latest
docker container ls                                    # Q2
# Application : http://localhost:4100
docker rm -f booksclient booksserver mysqldb           # nettoyage avant compose
```

## 2. Docker Compose (Q3)

```bash
cd docker
docker compose up -d --build                           # Q3
docker compose down
```

## 3. Kubernetes (Q4–Q6)

```bash
cd k8s
# kind : kind load docker-image mysql:8 books-rest-api:latest books-api-client:latest
# minikube : minikube image load books-rest-api:latest ; minikube image load books-api-client:latest
kubectl apply -f .                                     # Q4
kubectl get deployments                                # Q5
kubectl get pods                                       # Q6
kubectl port-forward svc/booksserver 8080:8080         # puis http://localhost:8080/books-api/authors
kubectl delete -f .
```

Note : les captures ont été produites dans un environnement Linux où le pare-feu iptables de Docker
n'était pas disponible ; les conteneurs Docker y ont donc été lancés en `--network host`
(même images, mêmes variables d'environnement). Kubernetes a été exécuté avec kind.
