# 🚖 Cabbit – A Microservices-Based Ride Booking App

Cabbit is an Uber-like ride booking platform built using a microservices architecture. It consists of three primary services — **User**, **Ride**, and **Captain** — working together to deliver a seamless ride-hailing experience.

---

## 🧩 Services Overview

### 1. **User Service**
Handles user registration, authentication (including Google OAuth), user profiles, and pickup/drop location data.

- **Features:**
  - Register/Login with email & password
  - OAuth (Google)
  - Profile management
  - Location storage (pickup/drop)
  - JWT-based authentication

---

### 2. **Captain Service**
Manages captains (drivers), their availability, status, and real-time location updates.

- **Features:**
  - Captain registration/login
  - Set availability (online/offline)
  - Location tracking
  - Accept/reject ride requests

---

### 3. **Ride Service**
Coordinates the entire ride lifecycle — from booking and matching to ride completion and feedback.

- **Features:**
  - Ride creation and matching with captains
  - Track ride progress
  - Communication between user and captain
  - Ride history and status updates

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** JWT, OAuth2 (Google)
- **Communication:** REST API, Socket.IO
- **Deployment:** Vercel / Render / Custom

---

## 🚀 Getting Started

### Clone the repo
```bash
git clone https://github.com/TrainedDev/Cabbit-.git
cd Cabbit-

## Setup instructions per service

Each service (/user, /ride, /captain) contains its own package.json and environment variables.

1.Go to a service folder:
  cd user

2.Install dependencies:
npm install

3.Set up environment variables:
Create a .env file using the provided .env.example (if available)

4:Run the service:
npm start

Repeat for the other two services.
    
## Folder Structure

/Cabbit-
  ├── user/       # Handles user auth & profiles
  ├── ride/       # Manages ride creation, matching & history
  └── captain/    # Handles driver actions & availability

## 🧪 Testing

Coming soon: Unit & integration tests using Jest and Postman collection.


## 🧠 Future Plans

Real-time location tracking on frontend (MapBox/Google Maps)

Payment integration (Stripe/Razorpay)

Notifications (SMS/email)

Admin panel for monitoring rides and users
## 🙌 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.
## License

[MIT](https://choosealicense.com/licenses/mit/)

