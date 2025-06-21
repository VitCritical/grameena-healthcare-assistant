# 🌾 Grameena Healthcare Assistant

Grameena Healthcare Assistant is a rural-focused, multi-language web application designed to provide essential medical utilities like symptom checking, medicine reminders, emergency first aid, and patient record keeping.

Built with ❤️ for the **Code for Telangana Hackathon**, it empowers communities in **Telugu**, **Hindi**, and **English**, and works efficiently even on mobile devices.

---

## 🚀 Live Demo

🔗 [Visit App]([https://your-deployment-url.com](https://grameena-health.netlify.app/))

---

## 📱 Features

### 🌐 Multilingual Support

- Toggle between **Telugu**, **Hindi**, and **English** on every page
- Automatic UI translation (home, symptom checker, reminders, etc.)

### 🎤 Voice Assistant

- Fully functional voice assistant (free)
- Recognizes **Telugu**, **Hindi**, and **English** prompts
- Helps users navigate the app, use symptom checker, and more

### 🔐 Authentication & Database

- Firebase Auth (Email/Password)
- Secured login and registration
- Health records stored securely in Firestore

### 📍 Page Highlights

- **Symptom Checker**: List symptoms and get possible conditions
- **First Aid Guide**: Immediate steps for common medical emergencies
- **Medicine Reminders**: Personalized reminders with time settings
- **Health Records**: Save, view, and update patient details

### 📲 Mobile Optimized

- Mobile header moves to bottom for easier access
- Clean layout with large buttons, logo, and language display
- Sidebar for navigation, logo-only navbar

### ↔️ Navigation & Translations

- Toggle button for language (not dropdown)
- Back arrow for navigation between pages
- Sidebar with menu items (Home, Checker, First Aid, etc.)

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Firebase Auth & Firestore
- **i18n**: react-i18next
- **Voice Recognition**: Web Speech API

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/VitCritical/grameena-healthcare-assistant.git
cd grameena-healthcare-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Firebase Environment Variables

Create a `.env` file based on the example below:

#### 📁 `.env.example`

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Run the App

```bash
npm run dev
```

---

## 🧠 Future Enhancements

- Progressive Web App (PWA) support for full offline use
- Clinic locator using GPS
- Google Fit integration for vitals

---

## 🤝 Contributing

We welcome community contributions! Just fork the repo, create a branch, and submit a PR.

---

## 📧 Contact

Built by [Vexith Reddy](mailto\:vexithreddy@gmail.com)

---

> "Taking healthcare to the heart of rural India – one feature at a time."

