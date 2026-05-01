# AI Stress Assistant Bot (Exam Ease) 🧠✨

Your personal AI companion for managing exam stress and mental well-being.

## 📌 Project Overview
AI Stress Assistant Bot is a full-stack web application designed to support students dealing with exam pressure. It combines computer vision for real-time emotion detection with a Large Language Model based empathetic chatbot to provide personalized encouragement and support.

The application acts as a supportive peer, offering breathing exercises, motivational quotes, and stress tracking powered by advanced AI technologies.

## 🚀 Features
- 🎭 **Real-Time Emotion Detection:** Uses webcam input with FER and DeepFace supported by OpenCV.
- 🤖 **Empathetic AI Chatbot:** Powered by Groq (Llama 3.1) for natural emotional conversations.
- 🌬️ **Breathing Exercises:** Guided sessions to calm anxiety.
- 💬 **Motivational Quotes:** Positive affirmations to boost morale.
- 📈 **Progress Tracking:** Visual emotional trends over time.
- 🛡️ **Privacy First:** No video data is stored, and chat sessions are strictly stateless.

## 🛠 Tech Stack
- **Backend:** Python, Flask, DeepFace, OpenCV, TensorFlow CPU, Groq, Gunicorn
- **Frontend:** React, Vite, Tailwind CSS, Shadcn UI, Axios

## 📂 Folder Structure
- `backend/` — Flask server and ML logic
- `mindful-calm-buddy-main/` — React frontend
- `Screenshots/` — UI images

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
FLASK_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`mindful-calm-buddy-main/.env`)
```env
VITE_API_URL=https://ai-stress-assistant-bot-2.onrender.com
```

---

## 🚀 Production Deployment

### 1. Deploying the Backend (Render)
This project is configured out-of-the-box for **Render's Free Tier**.
1. Create a **New Web Service** on Render.
2. Connect this repository and set the Root Directory to `backend`.
3. Render will automatically detect `render.yaml` and configure the environment (Python 3.11, Gunicorn, Port Binding).
4. Add your `GROQ_API_KEY` and `FRONTEND_URL` in the Environment Variables tab.

### 2. Deploying the Frontend (Vercel)
1. Import this repository into Vercel.
2. Set the **Root Directory** to `mindful-calm-buddy-main`.
3. Set the Framework Preset to **Vite**.
4. Add the `VITE_API_URL` environment variable pointing to your Render backend URL.
5. Deploy!

---

## 💻 Local Development

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd mindful-calm-buddy-main
npm install
npm run dev
```

---

## ✍️ Author
**Nandha**  
[GitHub Profile](https://github.com/Nandha-0301)  
*Built with ❤️ for student mental health.*
