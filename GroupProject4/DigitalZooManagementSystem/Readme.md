# Virtual Safari: Digital Zoo Management System

This project is a comprehensive digital representation system for the "Virtual Safari" digital zoo, allowing for the management of animals, habitats, staff, visitors, and events.

## Project Overview

The Virtual Safari system is designed to be a full-stack application with:
- TypeScript-based frontend for user interface
- Python (Django) backend for business logic
- PostgreSQL database for data storage

## Software Dependencies

### Docker & Git
* Docker https://www.docker.com/
* Git https://git-scm.com/downloads

### Backend (Django)
* Python 3.11 or higher
* Django 4.x or higher
* `psycopg2` (PostgreSQL adapter for Python)

### Frontend (React)
* Node.js (Recommended: 14.x or higher)
* npm (Node Package Manager)
* React 18.x or higher
* TypeScript 4.x or higher

### Database (PostgreSQL)
* PostgreSQL 13.x or higher

## Setup Instructions

### Step 1: Clone the Repository
Clone this repository to your local machine:

```bash
git clone https://github.com/Laurent-B2002/DigitalZooManagementSystem.git
cd DigitalZooManagementSystem
```

### Step 2: Build and Start the Containers
Run the following command to build and start all Docker containers:

```bash
docker-compose up -d --build
```

### Step 3: Run Migrations
Once the containers are up and running, enter the backend Django container:

```bash
docker-compose exec backend_django bash
```

Inside the container, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Access the Frontend
Open your browser and visit:

```
http://0.0.0.0:3000
```

### Step 5: Stop the Containers
To stop and remove the running containers:

```bash
docker-compose down
```

Your PostgreSQL data will persist between runs.

## Docker Compose Services

* **db** – PostgreSQL database
* **frontend** – React/TypeScript frontend
* **backend_django** – Django backend

## Project Structure

```
DigitalZooManagementSystem/
├── frontend/                # React frontend
├── Django Backend/          # Django backend
├── docker-compose.yml       # Docker configuration
└── README.md                # This file
```

## Features

### Animal Classification System
- Classification based on species, diet, and characteristics
- Association with specific habitats

### Habitat Management
- Digital representation of zoo habitats
- Association with Animals

### Zookeeper Management
- Staff scheduling and task assignment

### Visitor Experience
- Tour booking and management

### Membership and Events
- Membership tiers and benefits
- Special event planning and execution
