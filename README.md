
# CV Generator Project
## Production link  

https://cv-generator-efrei.netlify.app

**DB STORAGE** : Mongo Atlas 
**BACKEND** : Railway
**FRONT** : Netlify

## Project Overview

The **CV Generator** is a web application that allows users to create, manage, and share their resumes (CVs). Users can register, log in, and build their CVs with various sections such as personal information, educational experiences, professional experiences, certifications, and more. Users can choose to make their CVs public or private and can view and leave recommendations on other users' public CVs.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project Locally](#running-the-project-locally)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Contributors](#contributors)


## Features

1. **User Authentication**
   - Register and log in with secure authentication using JSON Web Tokens (JWT).
   - Access to CV creation and management features upon authentication.

2. **CV Creation and Management**
   - Create and edit CVs with fields like name, surname, description, educational experiences, professional experiences, certifications, and interests.
   - Possibility to delete CVs.
   - Set CV visibility to public or private.

3. **CV Consultation**
    - View of user CVs.
   - View public CVs of other users.
   - Search for CVs by name or surname.
   - Authenticated users can view detailed CVs.

4. **Recommendations**
   - Authenticated users can leave recommendations on other users' CVs.
   - Recommendations are visible to all users.

5. **Deployment**
   - The application is deployed online for both the front-end and back-end.

6. **Documentation**
   - Comprehensive API documentation is provided using Swagger UI.
   - Instructions are included for running the project locally.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** and **npm** installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).
- **MongoDB** installed locally or have a MongoDB Atlas account for a cloud database.
- **Git** for version control.

## Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
https://github.com/julienESN/CV-GENERATOR.git
```

### 2. Navigate to the Project Directory

```bash
cd cv-generator
```

### 3. Install Dependencies for Front-end and Back-end

#### Front-end Setup

```bash
npm install
```

#### Back-end Setup

Open a new terminal window/tab, and from the root directory:

```bash
cd backend
npm install
```

## Running the Project Locally

### 1. Set Up Environment Variables

Create environment variable files for both the front-end and back-end based on the provided examples.

#### Front-end `.env.local`

Create a file named `.env.local` in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Back-end `.env`

Create a file named `.env` in the `backend` directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

- Replace `your_mongodb_connection_string` with your MongoDB connection string.
- Replace `your_jwt_secret_key` with a secure secret key for JWT.

### 2. Start the Back-end Server

In the `backend` directory, run:

```bash
npm run dev
```

- This starts the server on `http://localhost:5000`.

### 3. Start the Front-end Server

In the `frontend` directory (you may need to open a new terminal window/tab), run:

```bash
npm run dev
```

- This starts the React development server, usually on `http://localhost:3000`.

### 4. Access the Application

- Open your web browser and navigate to `http://localhost:3000` to use the application.

## Environment Variables

### Front-end `.env.local.example`

```env
VITE_API_URL=http://localhost:5000/api
```

### Back-end `.env.example`

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

- **Note:** Do not commit your actual `.env` files to version control. Use the `.env.example` files as templates.

## API Documentation

The API is documented using Swagger UI. Once the back-end server is running, you can access the documentation at:

```
http://localhost:5000/api-docs
```

This documentation provides detailed information on all available endpoints, request parameters, and responses.

## Technologies Used

- **Front-end:**
  - React
  - React Hooks
  - Axios
  - Tailwind CSS (or any other CSS framework you may have used)

- **Back-end:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JSON Web Tokens (JWT) for authentication
  - Swagger UI for API documentation

## Contributors

- **Esnault Julien** - [GitHub Profile](https://github.com/julienESN)
- **Clément** - [GitHub Profile](https://github.com/cleluke)
