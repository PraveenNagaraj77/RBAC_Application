# RBAC MERN Application

## Project Overview
This is a full-stack MERN application implementing **Role-Based Access Control (RBAC)** with three main user roles:
- **Superadmin**
- **Admin**
- **User**

The system supports role-based UI rendering and backend API authorization, secured with JWT authentication.

---

## Technology Stack
- **Frontend:** React.js, Axios, React Context API, React Router, React Toastify  
- **Backend:** NestJS (Node.js framework), TypeScript  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication & Authorization:** JWT, NestJS guards for role and permission checks

---

## User Roles and Permissions

| Role       | Permissions                                                                                  |
|------------|----------------------------------------------------------------------------------------------|
| Superadmin | Full access to manage users, roles, permissions, and all dashboards and features             |
| Admin      | Can manage users, access Admin dashboard, limited access to roles/permissions                |
| User       | Basic access to own profile and User dashboard only                                         |

---

## Authentication & Authorization Flow
1. User registers → automatically assigned `user` role  
2. User logs in → receives JWT token  
3. Frontend stores token and user role in context  
4. Role-based routing determines dashboard rendering  
5. API requests include JWT token → backend validates role and permissions via guards

---

## Backend Features
- Register API creates user with `user` role  
- Login API issues JWT tokens on successful authentication  
- Role guard middleware to protect routes by role  
- Bulk permission insertion for core roles (`superadmin`, `admin`, `user`)  
- CRUD operations for users and roles  

---

## Frontend Features
- Role-specific dashboards: Superadmin, Admin, User  
- Automatic login after registration  
- Authentication state management via Context API  
- Axios interceptors add JWT token to API requests  
- Navigation controls and logout functionality  
- Toast notifications for success/error messages  

---

## Application Workflow
- New user registers → assigned `user` role → auto-login  
- User logs in → token saved → redirected to role-specific dashboard  
- Dashboard displays role-specific controls and navigation  
- User actions call protected APIs with JWT authorization  

---

## Setup & Installation

### Backend
```bash
cd backend
npm install
npm run start:dev
