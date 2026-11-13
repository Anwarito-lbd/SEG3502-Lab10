# Proof of Work — SEG3502 Lab 10

## 1. Local Toolchain & Verification Scope

| Check | Local Tool Availability | Observed Result |
|---|---|---|
| Backend Kotlin/Gradle compilation (`books-rest-api`) | OpenJDK `21.0.12.1+1-LTS` + Gradle Wrapper `8.0` | **PASS** (`BUILD SUCCESSFUL in 5m 14s`, `3 actionable tasks: 3 executed`) |
| Docker Compose & Kubernetes YAML parsing | Python `3.12.10` + `PyYAML` | **PASS** (6/6 YAML files, 10 YAML documents parsed cleanly) |
| JSON config validation (`package.json`, `env*.json`) | Python `3.12.10` `json.load` | **PASS** (3/3 JSON files valid) |
| SVG architecture diagram XML validation | Python `3.12.10` `xml.etree.ElementTree` | **PASS** (`docs/images/container-architecture.svg`) |
| Live container / cluster checks (`docker`, `kubectl`) | Not installed on this Windows host | **Not executed locally** — runtime proof relies on previously captured Linux + `kind` cluster screenshots in `docs/screenshots/` |

---

## 2. Backend Compilation (`books-rest-api`)

### Command Executed
```powershell
cd books-rest-api
.\gradlew.bat compileKotlin compileTestKotlin --console=plain
```

### Observed Output
```text
> Task :processResources
> Task :compileKotlin
> Task :compileJava NO-SOURCE
> Task :classes
> Task :compileTestKotlin

BUILD SUCCESSFUL in 5m 14s
3 actionable tasks: 3 executed
```

*(Note: `BooksRestApiApplicationTests.contextLoads()` requires a live MySQL instance at `MYSQL_HOST:3306`, so full `@SpringBootTest` execution is tied to the Docker/Compose/Kubernetes runtime rather than standalone local unit testing.)*

---

## 3. Docker Compose & Kubernetes Manifest Validation

Executed via Python `PyYAML` (`yaml.load_all` with Compose `!reset` tag support):

```text
PASS docker\docker-compose.hostnet.yml: 1 YAML document(s)
     services=['mysql', 'booksserver', 'booksapp']
PASS docker\docker-compose.yml: 1 YAML document(s)
     services=['mysql', 'booksserver', 'booksapp']
PASS k8s\booksclient-deployment.yaml: 2 YAML document(s)
     kind=Service, name=booksapp
     kind=Deployment, name=booksapp
PASS k8s\booksserver-deployment.yaml: 2 YAML document(s)
     kind=Service, name=booksserver
     kind=Deployment, name=booksserver
PASS k8s\mysql-deployment.yaml: 2 YAML document(s)
     kind=Service, name=mysql
     kind=Deployment, name=mysql
PASS k8s\mysql-volume.yaml: 2 YAML document(s)
     kind=PersistentVolume, name=mysql-data
     kind=PersistentVolumeClaim, name=mysql-data
```

JSON & container build config checks:

```text
PASS bookstore-client/package.json: valid JSON (keys=['name', 'version', 'scripts', 'private', 'dependencies', 'devDependencies'])
PASS bookstore-client/src/assets/env.json: valid JSON (keys=['apiUrl'])
PASS bookstore-client/src/assets/env.template.json: valid JSON (keys=['apiUrl'])
PASS books-rest-api/Dockerfile: 12 non-empty lines
PASS bookstore-client/Dockerfile: 17 non-empty lines
PASS bookstore-client/entrypoint.sh: 5 non-empty lines
```

---

## 4. PII & Privacy Audit

| Artifact | Finding | Remediation Applied on Branch |
|---|---|---|
| `README.md` | Contained 9-digit student ID numbers | Redacted personal student IDs; retained clean course and first-name attribution |
| `RAPPORT_LAB10.pdf` | Page 1 contained 9-digit student ID numbers | Removed `RAPPORT_LAB10.pdf` from branch (`git rm`) |
| `docs/screenshots/*.png` | Inspected 7 captured screenshots (`lab10_q1`–`lab10_q6`, `lab10_app`) | Clean — no student IDs or personal secrets present |
| `books-rest-api/`, `bookstore-client/`, `docker/`, `k8s/` | Scanned all text/source/manifest files for `300\d{6}` and personal info | Clean — only academic container demo credentials (`MYSQL_ROOT_PASSWORD=root`, Angular demo login `admin`/`password`) |

> **Git History Advisory:** Because the baseline `main` commit (`059ff20`) predates this branch, the removed PDF and original `README.md` remain reachable in commit history until history is rewritten/squashed prior to making the repository public.
