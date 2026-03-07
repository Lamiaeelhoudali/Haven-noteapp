# 🌿 Haven
### *A place where your thoughts feel at home*

Haven is a full-stack notes and journaling web app built with React and Node.js. It lets you write, organize, and reflect — with mood tracking, markdown notes, journaling streaks, and a calming, customizable interface.

---

## ✅ What You Need First

Install these before running Haven:

| Tool | Download Link |
|------|--------------|
| Node.js (v18+) | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| VS Code | https://code.visualstudio.com |

---

## 🚀 How to Run on Windows

### Step 1 — Extract the zip
Right click Haven.zip → Extract All → Desktop

### Step 2 — Open in VS Code
```
File → Open Folder → select Haven folder → Open
```

### Step 3 — Start MongoDB
Press Windows + R, type:
```
services.msc
```
Find MongoDB → Right click → Start

### Step 4 — Start the Backend
On the LEFT panel in VS Code:
```
Right click the "backend" folder
→ Open in Integrated Terminal
```
Type:
```bash
npm install
npm run dev
```
✅ Wait until you see: **Haven server running on port 5000** and **MongoDB Connected**

### Step 5 — Start the Frontend
On the LEFT panel in VS Code:
```
Right click the "frontend" folder
→ Open in Integrated Terminal
```
Type:
```bash
npm install
npm start
```
If you see vulnerability warnings just type:
```bash
npm audit fix
```
Then:
```bash
npm start
```
✅ Browser opens at **http://localhost:3000**

---

## 🍎 How to Run on Mac

### Step 1 — Extract the zip
Double click Haven.zip — it will extract automatically to the same folder

### Step 2 — Open in VS Code
```
File → Open Folder → select Haven folder → Open
```

### Step 3 — Install Homebrew (if you don't have it)
Open Terminal (Cmd + Space → type "Terminal") and paste:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 4 — Install & Start MongoDB
In Terminal, type:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```
✅ MongoDB is now running in the background

### Step 5 — Start the Backend
On the LEFT panel in VS Code:
```
Right click the "backend" folder
→ Open in Integrated Terminal
```
Type:
```bash
npm install
npm run dev
```
✅ Wait until you see: **Haven server running on port 5000** and **MongoDB Connected**

### Step 6 — Start the Frontend
On the LEFT panel in VS Code:
```
Right click the "frontend" folder
→ Open in Integrated Terminal
```
Type:
```bash
npm install
npm start
```
If you see vulnerability warnings just type:
```bash
npm audit fix
```
Then:
```bash
npm start
```
✅ Browser opens at **http://localhost:3000**

---

## 🔑 Logging In

Haven uses your own local database, so **there are no pre-made accounts**. When the app opens in your browser:

1. Click **Sign Up** to create a new account (any email and password works)
2. Log in with those credentials
3. You're in — all your data stays local on your machine

---

## ⚠️ Important Notes

- Always start **backend first**, frontend second
- Both terminals must stay open while using the app
- Do NOT close VS Code while the app is running
- The .env file is already included — no setup needed

---

## ✨ Features

### 🌌 Login Page
- Animated aurora background
- 60 sparkling night stars (30 twinkling + 30 sparkling)
- 5 floating bubble orbs + animated waves
- Glassmorphism frosted glass card
- Field-level error messages

### 📝 Notes
- Create, edit, delete with markdown editor
- Bold, Italic, Headings, Lists, Checkboxes, Images
- Pin, Archive, Tag, Search
- 10 background styles per note
- Share via link, Export as .md or .txt
- Trash with restore

### 📖 Journal
- Mood tracker (8 moods)
- PIN lock for private entries
- Interactive calendar
- 🔥 Streak counter
- 25 writing prompts
- Daily word goal bar
- Tags, Pin, Archive

### 🎨 Appearance
- 8 color themes
- Light and Dark mode
- Custom color picker
- Collapsible sidebar

### 🔐 Security
- JWT authentication
- bcrypt password hashing
- Server-side validation
- Middleware route protection

---

## 📁 Project Structure

```
Haven/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   └── journalController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── Journal.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── journal.js
│   ├── .env          ← already configured!
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── Editor/NoteEditor.js
        │   ├── Journal/
        │   ├── Layout/
        │   ├── Notes/
        │   └── UI/
        ├── context/
        │   ├── AuthContext.js
        │   └── ThemeContext.js
        ├── pages/
        │   ├── AuthPage.js
        │   └── Dashboard.js
        ├── styles/global.css
        ├── utils/
        │   ├── api.js
        │   └── markdown.js
        ├── App.js
        └── index.js
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| Something went wrong on login | Backend is not running — start it first |
| ECONNREFUSED error | MongoDB not running — start via services.msc (Windows) or `brew services start mongodb-community` (Mac) |
| cd not working | Right click folder → Open in Integrated Terminal |
| 14 high vulnerabilities | Normal for React — just run npm audit fix then npm start |
| Windows Defender blocked node.exe | Allow node.exe and git.exe in Windows Security → Ransomware Protection |
| Port 5000 already in use | Change PORT=5001 in backend/.env |
| Stars not showing | Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac) |
| brew command not found (Mac) | Homebrew isn't installed — follow Step 3 in the Mac instructions above |
| MongoDB won't start on Mac | Run `brew services restart mongodb-community` in Terminal |

---

## 🛠️ Built With

| Technology | Purpose |
|-----------|---------|
| React 18 | Frontend UI |
| Node.js + Express | Backend server |
| MongoDB + Mongoose | Database |
| JWT + bcrypt | Authentication |
| Axios | HTTP requests |
| CSS @keyframes | All animations |
| Lucide React | Icons |

---

*Made with 🌿 and a lot of care*

---

## 📝 Reflection

Haven was by far the most challenging project I have worked on. Previous assignments felt difficult at the time, but this one was a completely different level — it pushed me in ways I did not expect.

The biggest challenge was turning an idea into an actual working product. It sounds simple, but the gap between imagining something and actually building it is huge. Every feature that looks easy from the outside — the interactive calendar, the theme switcher, the delete functionality, the animations on the login page — had its own set of problems that needed real patience and persistence to solve.

There were moments where nothing was working, where something I changed refused to reflect on screen, where I had to dig through the code just to understand why. But every single one of those moments had a breakthrough on the other side.

Haven taught me that building something real is not just about writing code — it is about problem solving, patience, and refusing to settle until it works the way you envisioned it. That is the kind of developer I want to be, and this project made me feel like I am heading in the right direction.
