# Docker Setup & Usage Guide

A complete guide to running the TrackMania Replica (Three.js) game inside Docker for Windows and Linux.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Linux Setup & Usage](#linux-setup--usage)
3. [Windows Setup & Usage](#windows-setup--usage)
4. [Common Docker Commands](#common-docker-commands)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need
- **Docker Desktop** (includes Docker and Docker Compose)
- **Git** (to clone/manage the repository)
- **Browser** (to access the application at `localhost`)
- ~2GB free disk space
- Internet connection (for downloading images and dependencies)

---

## Linux Setup & Usage

### 1. Install Docker & Docker Compose

#### Ubuntu/Debian:
```bash
# Update package manager
sudo apt update

# Install Docker
sudo apt install -y docker.io docker-compose

# Add current user to docker group (avoids needing sudo)
sudo usermod -aG docker $USER

# Apply group changes (restart session or run):
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

#### Fedora/RHEL:
```bash
sudo dnf install -y docker docker-compose
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

---

### 2. Start the Application

```bash
# Navigate to project directory
cd ~/Projects/MiniVibes/minivibes

# Option A: Using Docker Compose (Recommended)
docker-compose up -d

# Option B: Using Docker directly
docker build -t trackmania-replica .
docker run -it -p 3000:3000 -p 5173:5173 -v $(pwd):/app trackmania-replica

# Check if container is running
docker ps
```

### 3. Access the Application

Open your browser and go to:
- **Development Server**: `http://localhost:3000` or `http://localhost:5173`
- **Check logs**: `docker-compose logs -f`

### 4. Stop the Application

```bash
# Stop using Docker Compose
docker-compose down

# Remove volumes (careful - deletes data!)
docker-compose down -v

# Or stop container directly
docker stop trackmania-replica
docker rm trackmania-replica
```

### 5. Rebuild After Changes

```bash
# If you updated package.json or Dockerfile
docker-compose up -d --build

# Or without Docker Compose
docker build --no-cache -t trackmania-replica .
```

---

## Windows Setup & Usage

### 1. Install Docker Desktop for Windows

1. **Download Docker Desktop**: https://www.docker.com/products/docker-desktop
2. **Run the installer** and follow the setup wizard
3. **Enable WSL 2** (recommended during installation)
4. **Restart your computer** when prompted
5. **Verify installation**:
   ```powershell
   docker --version
   docker-compose --version
   ```

### 2. Configure Git for Windows

If you haven't already:
```powershell
# Install Git for Windows: https://git-scm.com/download/win
# Or use Chocolatey:
choco install git
```

### 3. Start the Application

**Option A: Using PowerShell (Recommended)**

```powershell
# Navigate to project
cd ~\Projects\MiniVibes\minivibes

# Start with Docker Compose
docker-compose up -d

# Check if it's running
docker ps

# View logs
docker-compose logs -f
```

**Option B: Using Docker Desktop GUI**

1. Open **Docker Desktop**
2. Go to **Dashboard** → **Containers**
3. Find "trackmania-replica" container
4. Click the play (▶️) button if not running
5. Click the container name to view logs

**Option C: Using Git Bash (if you prefer terminal)**

```bash
cd ~/Projects/MiniVibes/minivibes
docker-compose up -d
docker-compose logs -f
```

### 4. Access the Application

Open your browser:
- **Development Server**: `http://localhost:3000` or `http://localhost:5173`
- Or use `localhost` instead of `127.0.0.1`

### 5. Stop the Application

**PowerShell**:
```powershell
docker-compose down

# Remove volumes if needed
docker-compose down -v
```

**Docker Desktop GUI**:
1. Go to **Dashboard** → **Containers**
2. Click the stop (⏹️) button on "trackmania-replica"
3. Or click the delete (🗑️) button to remove completely

### 6. Rebuild After Changes

```powershell
# Rebuild the Docker image
docker-compose up -d --build

# Or without Docker Compose
docker build -t trackmania-replica .
docker run -it -p 3000:3000 -p 5173:5173 -v ${PWD}:/app trackmania-replica
```

---

## Common Docker Commands

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs <container-id>
docker logs -f <container-id>  # Follow logs (live)

# Execute command in running container
docker exec -it trackmania-replica bash
docker exec -it trackmania-replica npm install

# Stop a container
docker stop <container-id>

# Start a container
docker start <container-id>

# Remove a container
docker rm <container-id>
```

### Image Management

```bash
# List images
docker images

# Build image
docker build -t trackmania-replica .
docker build --no-cache -t trackmania-replica .  # Skip cache

# Remove image
docker rmi <image-id>
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Execute command in service
docker-compose exec app npm install

# Restart services
docker-compose restart

# View service status
docker-compose ps
```

---

## Troubleshooting

### Container Won't Start

**Linux/Mac:**
```bash
# Check detailed error logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

**Windows:**
```powershell
# Check logs in Docker Desktop GUI
# Or use PowerShell:
docker-compose logs
docker-compose down -v
docker-compose up -d --build
```

### Port Already in Use

If port 3000 or 5173 is already in use:

**Edit docker-compose.yml**:
```yaml
services:
  app:
    ports:
      - "3001:3000"    # Use 3001 instead
      - "5174:5173"    # Use 5174 instead
```

Then access: `http://localhost:3001` or `http://localhost:5174`

### Package Installation Issues

```bash
# Option 1: Rebuild with no cache
docker-compose down -v
docker-compose up -d --build

# Option 2: Install packages inside container
docker-compose exec app npm install
docker-compose exec app npm install package-name
```

### File Permission Issues (Linux)

```bash
# Fix permissions on host
sudo chown -R $USER:$USER ~/Projects/MiniVibes/minivibes

# Or in Docker container
docker-compose exec app chown -R node:node /app
```

### Docker Daemon Not Running (Windows)

- Open **Docker Desktop** application
- Wait for it to fully load (check system tray)
- Try your command again

### Memory Issues

If Docker runs out of memory:

**Windows (Docker Desktop Settings)**:
1. Right-click Docker icon → **Settings**
2. Go to **Resources**
3. Increase **Memory** slider (recommend 4GB minimum)
4. Click **Apply & Restart**

**Linux**:
```bash
# Check memory usage
docker stats

# Limit container memory
docker run -m 2g trackmania-replica
```

---

## Development Workflow

### Making Changes

```bash
# 1. Edit your code locally
# 2. Container watches for changes (hot reload enabled)
# 3. Refresh browser to see changes

# If changes aren't reflected
docker-compose down
docker-compose up -d --build
```

### Installing New Packages

```bash
# Option 1: Install and save to package.json
docker-compose exec app npm install package-name --save

# Option 2: Rebuild image
docker-compose down
# Edit package.json manually
docker-compose up -d --build
```

### Running Tests

```bash
docker-compose exec app npm test
```

### Accessing Container Shell

```bash
# Linux/Mac
docker-compose exec app bash

# Windows PowerShell
docker-compose exec app sh
```

---

## Performance Tips

1. **Use Docker volumes** for faster file sync (already configured)
2. **Use .dockerignore** to exclude large directories
3. **Use lighter base images** (alpine is already used)
4. **Cache Docker layers** by not changing package.json frequently
5. **Use `--no-cache` only when necessary**

---

## Next Steps

1. Create your `package.json` with project dependencies
2. Implement your Three.js TrackMania replica
3. Test locally with Docker
4. Commit your changes to Git
5. Push to GitHub

Happy coding! 🚀
