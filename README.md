# ✨ ARIA — AI Research & Intelligence Assistant
### 100% FREE — No credit card needed!

A production-ready full-stack MERN AI Assistant using **Groq (Llama 3.3)** — a completely free AI API that's actually faster than ChatGPT.

---

## 🆓 Free Services Used

| Service | What For | Cost |
|---|---|---|
| **Groq** | AI brain (Llama 3.3) | FREE forever |
| **MongoDB Atlas** | Database | FREE (512MB) |
| **Node.js / React** | Backend / Frontend | FREE |

---

## 🚀 Setup in 5 Steps

### Step 1 — Get Your FREE Groq API Key
1. Go to **https://console.groq.com**
2. Click **Sign Up** (use Google — takes 30 seconds)
3. Click **API Keys** in the left menu
4. Click **Create API Key**
5. Copy the key — it starts with `gsk_...`
6. ✅ Done! No credit card, no payment, completely free.

### Step 2 — Get Your FREE MongoDB Connection String
1. Go to **https://www.mongodb.com/atlas**
2. Click **Try Free** → Sign up with Google
3. Choose **M0 FREE** cluster (make sure it says $0/month)
4. Click **Create** and wait ~2 minutes
5. Click **Connect** → **Drivers** → Copy the connection string
6. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
7. Replace `<password>` with your actual password

### Step 3 — Set Up the Project
```bash
# Extract the zip, then open terminal in the ai-assistant folder:

# Install everything
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 4 — Create Your .env File
```bash
# In the backend/ folder, copy the example:
cd backend
# Windows:  copy .env.example .env
# Mac/Linux: cp .env.example .env
```

Open `backend/.env` and fill in:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://yourUser:yourPassword@cluster0.xxxxx.mongodb.net/ai-assistant

JWT_SECRET=any_long_random_text_here_123456

GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
AI_PROVIDER=groq
```

### Step 5 — Run It!
```bash
# From the root ai-assistant/ folder:
npm run dev
```

Open browser → **http://localhost:5173** 🎉

---

## 🔄 Want to use Google Gemini instead of Groq?

Both are free! To switch:
1. Get free key at **https://aistudio.google.com/app/apikey**
2. In your `.env`, change these lines:
```env
GEMINI_API_KEY=AIzaSy_your_key_here
GEMINI_MODEL=gemini-1.5-flash
AI_PROVIDER=gemini
```
3. Run: `cd backend && npm install @google/generative-ai`
4. Restart the server

---

## 📁 Project Structure
```
ai-assistant/
├── backend/
│   ├── server.js
│   ├── .env.example       ← Copy to .env and fill in
│   ├── config/db.js
│   ├── models/            ← User, Chat, Message
│   ├── controllers/       ← Auth, Chat (AI logic), File
│   ├── routes/
│   └── middleware/
└── frontend/
    └── src/
        ├── pages/         ← Login, Register, ChatPage
        ├── components/    ← Sidebar, ChatWindow, InputBar
        ├── context/       ← Auth state
        └── hooks/         ← Chat logic
```

---

## 🔧 Troubleshooting

| Error | Fix |
|---|---|
| `Invalid Groq API key` | Check GROQ_API_KEY in .env starts with `gsk_` |
| `MongoDB failed` | In Atlas → Network Access → Add `0.0.0.0/0` |
| Port 5000 in use | Change PORT=5001 in .env |
| npm install fails | Run `node --version` — need v18+ |
| `.env` not visible | In VS Code press Ctrl+Shift+P → "Toggle Excluded Files" |

---

## ⚡ Free Groq Models

| Model | Speed | Best For |
|---|---|---|
| `llama-3.3-70b-versatile` | Fast | Best quality (default) |
| `llama3-8b-8192` | Very Fast | Quick answers |
| `mixtral-8x7b-32768` | Fast | Long documents |
| `gemma2-9b-it` | Fast | Google's model |

Change model in `.env` → `GROQ_MODEL=model-name-here`

---

Built with ❤️ | Powered by FREE Groq AI
