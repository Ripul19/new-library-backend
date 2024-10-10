# Library Management System - Backend

## Overview
This is the backend for a Library Management System that handles user authentication, book management, and borrowing history. The system supports two roles: **Librarian** and **Member**. 

The backend is built using **Node.js**, **Express**, **Sequelize** ORM, and **PostgreSQL** for the database.

Technologies Used
Node.js: Backend runtime
Express: Web framework
Sequelize: ORM for database interactions
PostgreSQL: Database
JWT: Authentication
dotenv: For environment variables

## Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ripul19/new-library-backend.git
cd library-management-backend
```

### 2. Install Dependencied
```bash
npm install
```
### 3. Set up environment variables
```bash
PORT
DATABASE_URL
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
JWT_SECRET
```
You can check the .env.example file

### 4. Start the server
```bash
npm start
```
The server will start on port 3000 (or as defined in your .env file).

API details can be find the Library Management System Backend.docx file in the project folder

### 5. Deployment

Deployment is done on Vercel and its configrations can be checked in the vercel.json file