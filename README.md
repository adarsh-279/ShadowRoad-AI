# 🚨 ShadowRoad AI  
> **Predictive Road Intelligence System for Safer Driving**

---

## 🌍 Overview

India faces a massive road safety crisis, with over **1.78 lakh deaths annually** due to accidents.

Most existing systems are **reactive**—they respond *after* accidents happen.

**ShadowRoad AI** changes this approach.

It is a **predictive road intelligence system** built using the MERN stack that:
- Analyzes driving behavior in real-time  
- Detects potential risks before accidents occur  
- Alerts drivers proactively  

👉 The goal is simple: **Prevent accidents, not just report them.**

---

## 🚧 Problem Statement

### ❌ Reactive Traffic Systems
Current systems only act after incidents occur—no early warnings.

### ⚠️ Unsafe Driving Behavior
Overspeeding, harsh braking, and lack of awareness increase accident risk.

### 🧠 No Continuous Feedback Loop
Drivers don’t get insights to improve their driving habits.

---

## 💡 Solution — ShadowRoad AI

ShadowRoad AI introduces a **data-driven, predictive safety layer** for everyday driving.

### 🔥 Key Capabilities

- 🚨 **Real-time Risk Alerts**
- 🔴 **Dynamic Risk Zone Detection**
- 📊 **Driving Behavior Scoring**
- 🗺️ **Interactive Safety Map**
- 📈 **Pattern-based Risk Analysis**

---

## 🧠 Core Features

| Feature | Description |
|--------|------------|
| 🚗 Overspeed Detection | Alerts when speed exceeds safe limits |
| 💥 Harsh Braking Detection | Identifies sudden braking patterns |
| 🔴 Risk Zone Identification | Flags locations with repeated unsafe events |
| 📊 Driving Score | Evaluates driving quality |
| 🗺️ Map Visualization | Displays risk zones on map |

---

## ⚙️ How It Works

1. 📥 User inputs or simulates driving data (speed, braking, movement)  
2. ⚙️ Backend processes data using rule-based logic  
3. 🔁 Repeated risky events → **Risk Zones**  
4. 🚨 Alerts generated for unsafe behavior  
5. 💾 Data stored for pattern recognition & scoring  

---

## 🏗️ Tech Stack

### 🖥️ Frontend
- React.js  
- Tailwind CSS / Custom CSS  
- Leaflet.js / Google Maps API  

### ⚙️ Backend
- Node.js  
- Express.js  

### 🗄️ Database
- MongoDB  

---

## 🧩 System Architecture

### Flow Overview

1. **User Input**
   - Speed data
   - Driving events

2. **Frontend (React)**
   - Displays UI & Map
   - Sends data to backend

3. **Backend (Express API)**
   - Handles requests
   - Routes data to logic engine

4. **Logic Engine**
   - Calculates risk score
   - Detects dangerous conditions

5. **Database (MongoDB)**
   - Stores user data & logs

6. **Output**
   - Alerts
   - Risk score
   - Risk zones

---

## 📂 Project Structure

```bash

Directory structure:
└── ShadowRoad-AI/
    ├── backend/
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── server.js
    │   └── src/
    │       ├── app.js
    │       ├── controllers/
    │       │   ├── auth.controller.js
    │       │   ├── challan.controller.js
    │       │   ├── chatbot.controller.js
    │       │   └── law.controller.js
    │       ├── db/
    │       │   └── database.js
    │       ├── models/
    │       │   ├── challan.model.js
    │       │   ├── law.model.js
    │       │   └── user.model.js
    │       └── routes/
    │           ├── auth.routes.js
    │           ├── challan.routes.js
    │           ├── chatbot.routes.js
    │           └── law.routes.js
    ├── frontend/
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public/
    │   │   ├── favicon.svg
    │   │   └── icons.svg
    │   ├── src/
    │   │   ├── App.css
    │   │   ├── App.jsx.jsx
    │   │   ├── assets/
    │   │   │   ├── hero.png
    │   │   │   ├── react.svg
    │   │   │   └── vite.svg
    │   │   ├── components/
    │   │   │   ├── ChallanSystem.jsx
    │   │   │   ├── DriveLegal.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── HeroSection.jsx
    │   │   │   ├── HowItWorks.jsx
    │   │   │   ├── ImpactSection.jsx
    │   │   │   ├── LawsRegulations.jsx
    │   │   │   ├── LiveDemo.jsx
    │   │   │   ├── MapComponent.jsx
    │   │   │   └── Navbar.jsx
    │   │   ├── index.css
    │   │   └── main.jsx
    │   └── vite.config.js
    ├── LICENSE
    └── README.md

```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- React.js
- Node.js  
- MongoDB  
- npm / yarn  

---

### ▶️ Installation

#### Clone Repository
```bash
git clone https://github.com/adarsh-279/ShadowRoad-AI
cd shadowroad-mern
```

---

## 🌐 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint              | Description              |
|--------|----------------------|--------------------------|
| POST   | /api/auth/register   | Register new user        |
| POST   | /api/auth/login      | Login user               |
| GET    | /api/auth/getMe      | Get current user details |
| GET    | /api/auth/logout     | Logout user              |

---

### 🚗 Challan Routes
| Method | Endpoint                  | Description                |
|--------|--------------------------|----------------------------|
| POST   | /api/challan/check       | Check vehicle challan      |

---

### ⚖️ Law Routes
| Method | Endpoint           | Description                |
|--------|-------------------|----------------------------|
| GET    | /api/laws         | Get all traffic laws       |
| POST   | /api/laws/seed    | Seed laws into database    |

---

### 🤖 Chatbot Routes
| Method | Endpoint        | Description                 |
|--------|----------------|-----------------------------|
| POST   | /api/chatbot   | Get AI chatbot response     |
---

## 🔒 Privacy & Design Philosophy

- ❌ No camera usage  
- ❌ No personal identity tracking  
- ✅ Lightweight & scalable  
- ✅ Works with minimal hardware (smartphone-based)  

---

## 🚀 Future Scope

- 📍 Real-time GPS integration  
- 🤖 AI/ML-based predictive modeling  
- 📳 Smart alerts (vibration/audio)  
- 🚦 Integration with smart traffic systems  
- 📡 IoT-based vehicle communication  

---

## 🏆 Hackathon Value

This project is a **functional MVP** that demonstrates:

- ✅ Real-world problem solving  
- ✅ Scalable architecture  
- ✅ Practical AI-inspired logic  
- ✅ High social impact  

---

## 📢 Vision

> “Road safety should be proactive, not reactive.”  
> ShadowRoad AI aims to build a future where **accidents are predicted and prevented before they happen.**

---

## ⭐ Support

If you found this project useful or interesting:

- ⭐ Star the repository  
- 💬 Share your feedback  
- 🤝 Contribute ideas  
