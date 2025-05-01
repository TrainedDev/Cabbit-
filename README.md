# 🚖 Velora – Ride Booking Platform (Microservices Architecture)

**Velora** is a scalable ride-booking platform inspired by apps like Uber, built using a microservices architecture. It separates responsibilities into three independently deployed services:

- 🧑‍💼 **User Service** – Handles user registration, login, OAuth, and ride tracking  
- 👨‍✈️ **Captain Service** – Manages captain registration, availability, and ride assignments  
- 🚗 **Ride Service** – Coordinates ride creation and status updates  

All services are live and ready to use — no local setup required.

---

## 🌐 Live Services

| Service       | URL                                                                 |
|---------------|----------------------------------------------------------------------|
| 🧑‍💼 User      | [`https://velora-user-server.onrender.com`](https://velora-user-server.onrender.com)         |
| 👨‍✈️ Captain   | [`https://velora-captain-server.onrender.com`](https://velora-captain-server.onrender.com)   |
| 🚗 Ride       | [`https://velora-ride-server.onrender.com`](https://velora-ride-server.onrender.com)         |

---

## 🧑‍💼 User Service

> Base URL: `/auth`  
> Handles registration, login (including Google/GitHub), and ride status for users.

### 🔐 Authentication

| Method | Route                     | Description                            |
|--------|---------------------------|----------------------------------------|
| POST   | `/auth/register`          | Register a new user                    |
| POST   | `/auth/login`             | Login and receive token in cookie      |
| GET    | `/auth/github`            | Redirect to GitHub OAuth               |
| POST   | `/auth/github/callback`   | GitHub OAuth callback                  |
| GET    | `/auth/google`            | Redirect to Google OAuth               |
| POST   | `/auth/google/callback`   | Google OAuth callback                  |

### 👤 User Features

| Method | Route                         | Description                            |
|--------|-------------------------------|----------------------------------------|
| GET    | `/auth/profile`               | Get the logged-in user’s profile       |
| GET    | `/auth/user/ride/status`      | Check status of user's requested ride  |

---

## 👨‍✈️ Captain Service

> Base URL: `/auth`  
> Manages captain onboarding, verification, availability, and ride fetch.

### 🔐 Authentication

| Method | Route                       | Description                            |
|--------|-----------------------------|----------------------------------------|
| POST   | `/auth/register`            | Register a new captain                 |
| POST   | `/auth/login`               | Login captain and get cookie token     |
| GET    | `/auth/google`              | Redirect to Google OAuth               |
| POST   | `/auth/google/callback`     | Google OAuth callback                  |

### 👨‍✈️ Captain Features

| Method | Route                                | Description                              |
|--------|--------------------------------------|------------------------------------------|
| POST   | `/auth/upload/verification/data`     | Upload PAN & license for verification    |
| GET    | `/auth/captain/profile`              | Fetch captain’s profile                  |
| PATCH  | `/auth/captain/availability`         | Toggle captain’s availability            |
| GET    | `/auth/fetch/ride`                   | Fetch available rides                    |

---

## 🚗 Ride Service

> Base URL: `/ride`  
> Connects users and captains through ride creation and assignment.

| Method | Route                | Description                                |
|--------|----------------------|--------------------------------------------|
| POST   | `/ride/create`       | Create a new ride (user must be logged in) |
| PATCH  | `/ride/status`       | Update ride status (captain accepts ride)  |

---

## 🔁 Full Request Flow

1. **User** and **Captain** log in or register (or use OAuth).
2. Tokens are securely stored in **HTTP-only cookies**.
3. **Captain** polls `/auth/fetch/ride` to check for ride requests.
4. **User** creates a ride via `/ride/create`.
5. Within ~30 seconds, the ride appears for the captain to accept.
6. Captain updates ride status using `/ride/status`.

---

## 🔐 Authentication Notes

- Tokens are stored as **secure HTTP-only cookies**.
- All protected routes require valid cookies for access.
- ❌ There is **no logout endpoint** — cookies can be cleared manually.

---

## 🚀 Technologies Used

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** authentication via cookies
- **OAuth2** (Google & GitHub)
- **Multer** for file uploads (captain verification)
- **Render** for hosting microservices

---

## 📦 Project Structure

```
Velora/
├── User Service (auth)
├── Captain Service (auth)
└── Ride Service (ride)
```

Each service has its own database and handles only its domain logic.

---

## 🤝 Contributing

Have a feature idea or found a bug?  
Fork the repo → Create a branch → Commit your changes → Open a pull request ✅

GitHub: [TrainedDev/Velora](https://github.com/TrainedDev/Velora)

---

## 🪪 License

This project is licensed under the [MIT License](LICENSE).

---

## ✨ Created by [TrainedDev](https://github.com/TrainedDev)
