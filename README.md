# EHR-secure-health-vault (In Progress)
A full-stack Electronic Health Record (EHR) web application that enables secure, encrypted, and role-based access for doctors and patients. The project focuses on **privacy-first architecture**, with sensitive medical data encrypted at rest and in transit.

---

## Features

-  **Doctor and Patient Role-Based Access**
-  **AES-Encrypted Patient Data** (except name, for identification)
-  **Bcrypt-Hashed Passwords**
-  **Appointment Booking System**
-  **Patient Dashboard with Health Reports & Graphs**
-  **Secure Messaging Between Doctor and Patient**
-  **Query Optimization & Encrypted Field Indexing**
- ⚙ **React Frontend Migration In Progress (MERN Alignment)**

---

##  Tech Stack

| Layer         | Technology            |
|--------------|------------------------|
| Frontend     | HTML/CSS/JS → Migrating to React.js |
| Backend      | Node.js + Express.js   |
| Database     | MySQL (with encrypted fields using AES) |
| Authentication | Bcrypt + JWT (planned) |
| Security     | AES Encryption, HTTPS, Role-based Access |

---

##  Project Structure

```

secure-ehr-system/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
├── frontend/ (React migration in progress)
├── .env
├── package.json
└── README.md

````

##  Performance (So Far)

>  *In progress*: Initial testing on local datasets showed a **\~20% reduction in API response time** after optimizing encrypted queries and route structure.

---

##  Security Focus

* **AES Encryption**: All medical data except patient names are encrypted before storing in the database.
* **Bcrypt Hashing**: All passwords are stored using secure bcrypt hashing with salt.
* **Role-based Authorization**: Only patients can book/view their appointments; only doctors can view/confirm them.

---

##  To-Do

* [x] Secure role-based signup/login
* [x] AES encryption for data at rest
* [x] Patient appointment system
* [ ] React-based frontend dashboard
* [ ] JWT-based session authentication
* [ ] Deployment (Render/Vercel + PlanetScale or Railway)

---

