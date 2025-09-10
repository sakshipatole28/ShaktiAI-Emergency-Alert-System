# ShaktiAI-Emergency-Alert-System
ShaktiAI is a smart SOS system using AI-powered gesture, facial, and voice detection to identify emergencies. Alerts are sent to nearby volunteers, and an Admin Dashboard tracks incidents and responses in real-time, enabling fast, efficient personal safety monitoring.

# ⚠️ ShaktiAI – Prototype (UI + Admin Only)

⚠️ This project is part of a **hackathon**. Code is open for learning and demo purposes only. All IP is retained by the authors for future publication.

This repository contains a **prototype** of the ShaktiAI system.  
It includes the **mobile app (Pilgrim & Volunteer UI)** and the **Admin dashboard**, but **AI models and MongoDB Atlas database are not yet connected**.  
The goal of this repo is to showcase the **user flow, offline-first concept, and demo-ready UI** for hackathons/presentations.

---

## 🚀 Features in This Prototype

- **Role-based Mobile App (React Native + Expo)**
  - **Pilgrim**: UI for SOS button + placeholders for AI detection.
  - **Volunteer**: Receives *mock alerts*, views incidents on map, and acknowledges response.

- **Mocked AI Models**
  - Gesture, motion inactivity, and scream detection are **stubbed with demo triggers**.

- **Offline Alert Transmission (Concept Only)**
  - Placeholder modules for Wi-Fi Direct & Bluetooth mesh.

- **Admin Dashboard (React.js)**
  - Displays *mock incidents*, volunteer responses, and density maps.

- **Demo Mode**
  - Includes mock responses for smooth hackathon demonstration.

---

## 🛠 Tech Stack

**Mobile App (Prototype)**
- React Native + Expo
- React Navigation (role-based flows)
- Realm/SQLite (local DB stubs)
- Mapbox / Google Maps (volunteer navigation)
- TensorFlow Lite + MediaPipe + Vosk (**planned for AI models**)

**Admin Dashboard (Prototype)**
- React.js + TypeScript
- Chart.js / Recharts (mock analytics)
- Firebase Auth Stub (placeholder login)

**Database (Planned Integration)**
- MongoDB Atlas (shared DB for both Mobile App & Admin Dashboard)  
  ⚠️ Currently not connected – mock data is used instead.

**Networking (Planned Integration)**
- Wi-Fi Direct + Bluetooth LE Mesh (offline alert transmission)

---

## 📂 Project Structure

shaktiai-mvp/
├─ UPDATE_SUMMARY.md
├─ VS_CODE_SETUP.md
├─ .vscode/                # VS Code settings
│  ├─ launch.json
│  ├─ settings.json
│  ├─ tasks.json
│
├─ admin-dashboard/        # React.js Admin Dashboard (mocked)
│  ├─ .gitignore
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ public/
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  ├─ robots.txt
│  ├─ src/
│  │  ├─ App.tsx
│  │  ├─ App.css
│  │  ├─ index.tsx
│  │  ├─ index.css
│  │  ├─ logo.svg
│  │  ├─ reportWebVitals.ts
│  │  ├─ setupTests.ts
│  │  ├─ react-app-env.d.ts
│
├─ demo/                   # Demo scripts & docs
│  ├─ QUICK_DEMO.md
│  ├─ run_demo.sh
│
├─ docs/                   # Documentation
│  ├─ ADMIN_DASHBOARD_DEMO.md
│
├─ mobile/                 # React Native Mobile App (Pilgrim + Volunteer roles)
│  ├─ app.json
│  ├─ App.tsx
│  ├─ App_Backup.tsx
│  ├─ App_Minimal.tsx
│  ├─ App_Original.tsx
│  ├─ App_Simple.tsx
│  ├─ index.ts
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ .expo/
│  │  ├─ devices.json
│  │  ├─ README.md
│  │  ├─ settings.json
│  ├─ assets/
│  │  ├─ adaptive-icon.png
│  │  ├─ favicon.png
│  │  ├─ icon.png
│  │  ├─ splash-icon.png
│  │  ├─ data/
│  │  │  ├─ incidents_sample.json
│  │  │  ├─ volunteer_locations_sample.json
│  │  ├─ models/
│  │  │  ├─ gesture_v1_metadata.json
│  │  │  ├─ voice_scream_v1_metadata.json
│  ├─ src/
│  │  ├─ components/
│  │  ├─ screens/
│  │  │  ├─ LoginScreen.tsx
│  │  │  ├─ PilgrimDashboard.tsx
│  │  │  ├─ RegistrationScreen.tsx
│  │  │  ├─ RoleSelectionScreen.tsx
│  │  │  ├─ SimpleLogin.tsx
│  │  │  ├─ SimplePilgrimDashboard.tsx
│  │  │  ├─ SimpleRoleSelection.tsx
│  │  │  ├─ SimpleVolunteerDashboard.tsx
│  │  │  ├─ VolunteerDashboard.tsx
│  │  ├─ services/
│  │  │  ├─ AIDetectionService.ts
│  │  │  ├─ AlertService.ts
│  │  │  ├─ AuthService.ts

---

## ⚙️ Setup Instructions

### 1. Mobile App
bash
cd shaktiai-mvp/mobile
npm install
npx expo start --host lan
  -Open Expo Go on your phone → scan QR code.

  -Login as Pilgrim or Volunteer.

  -Trigger SOS or mock AI alerts for demo.

2. Admin Dashboard
bash
Copy code
cd shaktiai-mvp/admin-dashboard
npm install
npm start
  -Runs at http://localhost:3000.

  -Shows mock incidents and volunteer responses.

📊 Demo Flow
1- Pilgrim taps SOS (or triggers a mock AI event).

2- Volunteer app receives mock alert.

3- Volunteer acknowledges → incident appears on Admin dashboard.

4- Admin dashboard displays analytics from mock data.

📦 Included in This Prototype

* UI for Pilgrim & Volunteer roles
* Mock alert transmission modules
* Demo incidents for Admin dashboard

Placeholder code for AI & DB integration

## 📞 **Final Demo Checklist**

**Before Demo**:
- [ ] Phone 1: Expo Go installed
- [ ] Phone 2: Expo Go installed  
- [ ] Laptop: Two terminals ready
- [ ] Browser: Ready for localhost:3000

**During Demo**:
- [ ] Show mobile QR code and admin dashboard simultaneously
- [ ] Demonstrate Pilgrim → Alert → Volunteer → Response flow
- [ ] Highlight logout functionality and professional UX
- [ ] Emphasize real-time coordination and social impact


✅ Roadmap (Next Steps)
1. Integrate TensorFlow Lite + MediaPipe gesture model in app

2. Add motion inactivity (faint detection) model

3. Integrate Vosk offline scream detection

4. Connect MongoDB for incident storage & sync

5. Implement real Wi-Fi Direct & BLE mesh alerts
