# Multi-Tenant Web Application

A full-stack multi-tenant web application with user roles (admin, manager, member), organization management, task assignment, and user invitation features.

## Features

- Multi-tenant architecture (separate organizations)
- User roles: Admin, Manager, Member
- Admin can invite users, manage roles, and delete users
- Task management: create, assign, update, and delete tasks
- Secure authentication with JWT
- Modern UI with React and Tailwind CSS

---

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

---

## Backend Setup

1. **Navigate to the backend folder:**
   ```sh
   cd Backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file based on the `.env.example`:**
   ```sh
   cp .env.example .env
   ```
4. **Set up MongoDB connection in the `.env` file.**
5. **Run the backend server:**
   ```sh
   nodemon server.js
   ```

---

## Frontend Setup

1. **Navigate to the frontend folder:**
   ```sh
   cd Frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the frontend server:**
   ```sh
   npm run dev
   ```

---

## Usage

- Access the application at `http://localhost:5173`
- Register as a new user or log in with existing credentials
- Admin users can manage organizations, roles, and tasks
- Managers and Members can manage tasks within their organization

---

## Contributing

1. **Fork the repository**
2. **Create a new branch:**
   ```sh
   git checkout -b feature/YourFeature
   ```
3. **Make your changes and commit them:**
   ```sh
   git commit -m "Add your message"
   ```
4. **Push to your forked repository:**
   ```sh
   git push origin feature/YourFeature
   ```
5. **Create a pull request**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
