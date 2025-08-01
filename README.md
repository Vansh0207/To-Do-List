# Full-Stack To-Do List Application

## Overview
This is a simple yet complete full-stack To-Do List application built with a JavaScript-centric stack. It allows users to register, log in, and manage their personal To-Do tasks, including task name, description, estimated time, and completion status.

## Features:
- **User Authentication:**
    - User Registration
    - User Login
    - JWT (JSON Web Token) based authentication for secure API access
    - User Logout
- **Personalized To-Do Management:**
    - Create new tasks with a name, description, and estimated time.
    - View all tasks belonging to the logged-in user.
    - Update existing tasks (edit name, description, estimated time, and completion status).
    - Mark tasks as completed/uncompleted.
    - Delete tasks.
- **Responsive UI:** Basic styling adapted for different screen sizes.
- **User Feedback:** Loading indicators, success, and error messages for a better user experience.
- **Backend Validation:** Server-side validation to ensure data integrity.

## Technologies Used

### Frontend
- **HTML5:** Structure of the web pages.
- **CSS3:** Styling and responsiveness.
- **JavaScript (Vanilla JS):** Client-side logic, DOM manipulation, and API interaction (using `fetch`).

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for building RESTful APIs.
- **MongoDB Atlas:** Cloud-hosted NoSQL database for data storage.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
- **`bcryptjs`:** For secure password hashing.
- **`jsonwebtoken`:** For implementing JSON Web Tokens (JWT) for authentication.
- **`dotenv`:** To manage environment variables (e.g., database URI, JWT secret).
- **`cors`:** Middleware for enabling Cross-Origin Resource Sharing.
- **`express-async-handler`:** Simplifies error handling in asynchronous Express routes.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (which includes npm)
- A MongoDB instance:
    - You can install [MongoDB Community Server](https://www.mongodb.com/try/download/community) locally.
    - **OR (Recommended for ease of setup):** Use a free tier [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database.

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Vansh0207/my-full-stack-todo-app.git](https://github.com/Vansh0207/my-full-stack-todo-app.git) # Replace with your actual repo URL
    cd my-full-stack-todo-app
    ```

2.  **Backend Setup:**
    a. Navigate into the `backend` directory:
       ```bash
       cd backend
       ```
    b. Install backend dependencies:
       ```bash
       npm install
       ```
    c. Create a `.env` file in the `backend` directory with your MongoDB Atlas connection string and a JWT secret:
       ```
       PORT=
       MONGO_URI=
       JWT_SECRET=
       ```

    d. Start the backend server:
       ```bash
       node server.js
       ```
       Keep this terminal window open.

3.  **Frontend Usage:**
    a. Open the `frontend/CRUD.html` file directly in your web browser. (You can usually double-click it).

    b. The application will load with the Registration/Login forms visible.
        - Register a new user.
        - Once registered (or logged in), the To-Do list interface will appear.
        - You can now create, read, update, and delete your tasks.
