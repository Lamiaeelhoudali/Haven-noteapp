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
- Share via link, Export as .txt
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

## 🧪 API Testing with Postman

The file `Haven-Postman-Collection.json` is included to test all backend endpoints directly.

### How to use it:

1. Open Postman → click **Import** → select `Haven-Postman-Collection.json`
2. Make sure your backend is running (`npm run dev`)
3. Run **Health Check** first to confirm the server is up — expected response: `{ "status": "Haven is running!" }`
4. Run **Login** → copy the `token` value from the response
5. Paste it in the **Headers** tab of any protected request:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

> ⚠️ The token expires after a while. If you get `"Token invalid"`, just run **Login** again and copy the new token.

### Endpoints covered:

| Group | Endpoints |
|-------|-----------|
| 🔐 Authentication | Register, Login, Get Current User, Health Check |
| 📝 Notes | Create, Get All, Update, Delete (Trash), Restore, Permanently Delete |
| 📖 Journal | Create, Create Locked, Get All, Update, Delete, Unlock, Get Calendar |
| 🧪 Validation | Tests that are expected to fail (wrong password, missing token, etc.) |

### Important tips:
- **Register** and **Health Check** do not need a token
- All other requests require `Bearer YOUR_TOKEN` in the **Headers** tab
- For Update, Delete, Restore, and Unlock — replace `:id` in the URL with the actual `_id` from a previous response
- Run **Get All Notes** or **Get All Journal Entries** if you need to find an ID

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
| Token invalid in Postman | Run Login again and copy the new token — tokens expire after 7 days |
| Entry/Note not found in Postman | Copy the `_id` from Get All Notes or Get All Journal Entries and use that in the URL |

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
| Postman | API testing |

---

*Made with 🌿 and a lot of care*
