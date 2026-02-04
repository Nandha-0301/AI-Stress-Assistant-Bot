AI Stress Assistant Bot (Exam Ease) 🧠✨

Your personal AI companion for managing exam stress and mental well-being.

📌 Project Overview

AI Stress Assistant Bot is a full-stack web application designed to support students dealing with exam pressure. It combines computer vision for real-time emotion detection with a Large Language Model (LLM) based empathetic chatbot to provide personalized encouragement and support.

The application acts as a supportive peer, offering features like breathing exercises, motivational quotes, and stress tracking, powered by advanced AI technologies.

🚀 Features

🎭 Real-Time Emotion Detection
Uses your webcam to detect facial expressions employing FER (Face Emotion Recognition) and DeepFace, supported by MediaPipe for face extraction.

🤖 Empathetic AI Chatbot (“Exam Ease”)
Interacts with users based on their detected emotion. Powered by Groq (Llama 3.1) for fast, natural conversations.

🌬️ Breathing Exercises
Guided sessions to help calm anxiety and regulate breathing.

💬 Motivational Quotes
Curated positive affirmations to boost morale.

📈 Progress Tracking
Visualizes emotional trends over time to help users understand their mental state.

🛡️ Privacy-First
Video feeds are processed locally (or strictly for detection) and never stored.

🛠 Tech Stack

Backend (Python / Flask)
Framework: Flask with Flask-Cors
AI/ML: deepface, fer, mediapipe, opencv-python, tensorflow, keras
LLM Integration: groq (Llama 3 client)
Utilities: python-dotenv, numpy, pillow

Frontend (TypeScript / React)
Framework: Vite + React
Styling: Tailwind CSS, Shadcn UI
Routing: React Router DOM
State/Data Fetching: TanStack Query
Visualization: Recharts
Icons: Lucide React

📂 Folder Structure

```
AI-Stress-Assistant-Bot/
├── backend/                  # Python Flask Server & ML Logic
│   ├── app.py                # Main application entry point
│   ├── haarcascade...xml     # Face detection model
│   ├── requirements.txt      # Backend dependencies
│   └── .env                  # API Keys & Config (Create this)
├── mindful-calm-buddy-main/  # React Frontend (Vite)
│   ├── src/                  # Source code (Components, Pages, Hooks)
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
├── README.md                 # Project Documentation
└── requirements.txt          # Root dependencies reference


⚙️ Installation & Setup

Clone the Repository

git clone https://github.com/Nandha-0301/AI-Stress-Assistant-Bot.git

cd AI-Stress-Assistant-Bot

Backend Setup

cd backend
python -m venv .venv

Windows:
.venv\Scripts\activate

Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt

Create a backend/.env file and add:

GROQ_API_KEY=your_groq_api_key_here
FER_CONFIDENCE_THRESHOLD=0.25
DEEPFACE_CONFIDENCE_THRESHOLD=0.30
EMOTION_HISTORY_SIZE=5

Frontend Setup

cd ../mindful-calm-buddy-main
npm install
npm run dev

▶️ How to Run

Start backend:

python app.py

Server runs on:
http://localhost:5000

Start frontend:

npm run dev

Open browser at the port shown in terminal (usually http://localhost:8080)

📸 Screenshots

Placeholder for dashboard, chat interface, and breathing exercises screenshots.

Tip: Allow camera access when prompted for emotion detection to work correctly.

✍️ Author

Nandha
GitHub: https://github.com/Nandha-0301

Built with ❤️ for student mental health.
