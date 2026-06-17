import os
import io
import base64
from collections import Counter, deque

import numpy as np
from PIL import Image
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq  # Groq Python client

# Face / emotion detection
import cv2

# --- Load env and configuration ---
load_dotenv()

os.environ["CUDA_VISIBLE_DEVICES"] = ""
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"  # hides INFO & WARNING logs
app = Flask(__name__)

# Security: Max upload size 10MB
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# CORS explicit whitelist and method configuration
default_origins = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080,http://localhost:8081,http://127.0.0.1:8081,https://ai-stress-assistant-chatbot.vercel.app,https://ai-stress-assistant-bot-g19f.vercel.app"
allowed_origins = os.getenv("ALLOWED_ORIGINS", default_origins).split(",")

CORS(app, resources={
    r"/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "OPTIONS"]
    }
}, supports_credentials=True)

# --- Configurable thresholds (can be overridden in .env) ---
FER_CONFIDENCE_THRESHOLD = float(os.getenv("FER_CONFIDENCE_THRESHOLD", "0.25"))
DEEPFACE_CONFIDENCE_THRESHOLD = float(os.getenv("DEEPFACE_CONFIDENCE_THRESHOLD", "0.30"))
EMOTION_HISTORY_SIZE = int(os.getenv("EMOTION_HISTORY_SIZE", "5"))

# --- Initialize Groq client safely ---
groq_api_key = os.getenv("GROQ_API_KEY")
client = None

if not groq_api_key:
    print("❌ GROQ_API_KEY missing in .env — Groq client disabled.")
else:
    try:
        # Initialize Groq client
        client = Groq(api_key=groq_api_key)
        print("✅ Groq client initialized successfully.")
    except TypeError as e:
        print(f"❌ Groq client TypeError: {e}")
        client = None
    except Exception as e:
        print(f"❌ Groq client init error: {e}")
        client = None

# --- Model Cache (Lazy Loading) ---
class ModelCache:
    face_cascade = None
    mediapipe_detector = None
    fer_detector = None
    deepface_warmed = False

def get_face_cascade():
    if ModelCache.face_cascade is None:
        haar_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        try:
            fc = cv2.CascadeClassifier(haar_path)
            if fc.empty():
                print(f"❌ Failed to load Haar cascade from {haar_path}. Face detection disabled.")
            else:
                ModelCache.face_cascade = fc
                print(f"✅ Haar cascade loaded from {haar_path}.")
        except Exception as e:
            print(f"❌ Error loading Haar cascade: {e}")
    return ModelCache.face_cascade

def get_mediapipe_detector():
    if ModelCache.mediapipe_detector is None:
        try:
            import mediapipe as mp
            ModelCache.mediapipe_detector = mp.solutions.face_detection.FaceDetection(
                model_selection=0, min_detection_confidence=0.35
            )
            print("✅ MediaPipe face detector ready.")
        except Exception as e:
            print(f"❌ MediaPipe face detector init failed: {e}")
    return ModelCache.mediapipe_detector

def get_fer_detector():
    if ModelCache.fer_detector is None:
        try:
            from fer.fer import FER
            ModelCache.fer_detector = FER(mtcnn=True)
            print("✅ FER emotion detector initialized.")
        except Exception as e:
            print(f"❌ Error initializing FER detector: {e}")
    return ModelCache.fer_detector

def warm_deepface():
    if not ModelCache.deepface_warmed:
        try:
            print("⏳ Warming up DeepFace emotion model...")
            from deepface import DeepFace
            DeepFace.build_model("Emotion")
            ModelCache.deepface_warmed = True
            print("✅ DeepFace emotion model ready.")
        except Exception as e:
            print(f"❌ Error warming DeepFace model: {e}")

emotion_history = deque(maxlen=max(EMOTION_HISTORY_SIZE, 1))

# --- Helper: smoothing + mediapipe face extraction ---
def smooth_emotion(label: str) -> str:
    if label in {"no_image", "no_face", "error"}:
        return label
    emotion_history.append(label)
    if not emotion_history:
        return label
    counts = Counter(emotion_history)
    best_label = label
    best_count = 0
    for historical in reversed(emotion_history):
        count = counts[historical]
        if count > best_count:
            best_label = historical
            best_count = count
    return best_label

def extract_face_via_mediapipe(frame_bgr):
    detector = get_mediapipe_detector()
    if not detector:
        return None

    rgb_frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = detector.process(rgb_frame)
    if not results.detections:
        return None

    detection = max(results.detections, key=lambda d: d.score[0] if d.score else 0)
    bbox = detection.location_data.relative_bounding_box
    h, w, _ = frame_bgr.shape
    x1 = max(int(bbox.xmin * w) - 10, 0)
    y1 = max(int(bbox.ymin * h) - 10, 0)
    x2 = min(int((bbox.xmin + bbox.width) * w) + 10, w)
    y2 = min(int((bbox.ymin + bbox.height) * h) + 10, h)
    if x2 <= x1 or y2 <= y1:
        return None
    return frame_bgr[y1:y2, x1:x2]

# --- Helper: emotion detection ---
def detect_emotion_from_image(base64_image_data: str):
    """
    Detects emotion from a base64 image using DeepFace.
    Returns: string (emotion label)
    """
    if not base64_image_data:
        print("❌ No image data provided")
        return "no_image"

    try:
        # Decode base64 image
        if "," in base64_image_data:
            _, encoded = base64_image_data.split(",", 1)
        else:
            encoded = base64_image_data
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Determine emotion
        result = None
        detected_emotion = "neutral" 
        confidence = 0.0

        # Try FER first (faster)
        fer = get_fer_detector()
        if fer:
            try:
                # FER requires RGB usually, but accepts BGR if configured. Let's pass RGB.
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                fer_results = fer.detect_emotions(rgb_frame)
                if fer_results:
                    best_detection = max(fer_results, key=lambda det: max(det["emotions"].values()))
                    fer_emotions = best_detection.get("emotions", {})
                    if fer_emotions:
                        detected_emotion, confidence = max(fer_emotions.items(), key=lambda x: x[1])
                        print(f"🧠 FER Emotion: {detected_emotion} ({confidence:.2f})")
                        return detected_emotion
            except Exception as e:
                print(f"DEBUG: FER failed: {e}")

        # Fallback to DeepFace
        try:
            warm_deepface()
            from deepface import DeepFace
            # DeepFace.analyze expects BGR or RGB path. We pass numpy array (BGR).
            # actions=['emotion']
            objs = DeepFace.analyze(
                img_path=frame, 
                actions=['emotion'],
                enforce_detection=False, # Don't crash if no face
                detector_backend='opencv' # Faster but less accurate than retinaface
            )
            
            if isinstance(objs, list) and len(objs) > 0:
                result = objs[0]
            elif isinstance(objs, dict):
                result = objs
            
            if result:
                detected_emotion = result.get('dominant_emotion', 'neutral')
                print(f"🧠 DeepFace Emotion: {detected_emotion}")
                return detected_emotion
                
        except Exception as e:
            print(f"DEBUG: DeepFace failed: {e}")

        # Custom Mapping
        detected_raw = detected_emotion.lower()
        if detected_raw in ["fear", "disgust", "sad"]:
            final_emotion = "sad"
        elif detected_raw == "angry":
            final_emotion = "angry" 
        elif detected_raw == "happy":
            final_emotion = "happy"
        elif detected_raw == "surprise":
             final_emotion = "happy" # Treat surprise as positive
        else:
            final_emotion = "neutral"

        # print(f"🧠 Detected: {detected_raw} -> Mapped: {final_emotion}")
        return final_emotion

    except Exception as e:
        print(f"❌ Exception in detect_emotion_from_image: {e}")
        return "neutral"

# --- /detect_emotion endpoint ---
@app.route("/detect_emotion", methods=["POST"])
def detect_emotion():
    try:
        data = request.get_json(silent=True)
        if not data or "image" not in data:
            return jsonify({"error": "No image data"}), 400

        image_data = data["image"]
        emotion = detect_emotion_from_image(image_data)
        
        return jsonify({
            "emotion": emotion,
            "status": "success"
        })

    except Exception as e:
        print(f"❌ Error in /detect_emotion: {e}")
        return jsonify({"error": str(e)}), 500

# --- /chat endpoint ---
SYSTEM_PROMPT = """
You are Exam Ease, a supportive and empathetic chatbot designed to help students in India manage the stress of exams (like board exams, university finals, JEE, NEET, etc.).
Your personality is calm, encouraging, and understanding. You are a supportive peer, not a therapist.
Keep responses concise, friendly, and easy to read.
Never give medical advice. If a user expresses thoughts of self-harm, your ONLY goal is to provide the KIRAN Mental Health Helpline number (1800-599-0019) and encourage them to call.
"""

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        user_message = data.get("message")
        current_emotion = data.get("currentEmotion", "neutral")
        client_history = data.get("history", [])

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Construct stateless context
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Append client history safely
        for msg in client_history:
            if isinstance(msg, dict) and msg.get("role") in ["user", "assistant"] and msg.get("content"):
                messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add the current message with hidden emotion context
        messages.append({"role": "user", "content": f"{user_message} (Context: User seems {current_emotion})"})

        if client:
            try:
                response = client.chat.completions.create(messages=messages, model="llama-3.1-8b-instant")
                bot_reply = response.choices[0].message.content
            except Exception as e:
                print(f"❌ Error calling Groq LLM: {e}")
                bot_reply = "Sorry, I'm having trouble generating a reply right now."
        else:
            bot_reply = "Hello — offline mode. I can't access the LLM. " + user_message[:300]

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print(f"❌ Error in /chat: {e}")
        return jsonify({"error": "Internal server error."}), 500

# --- Health & Root Endpoints ---
@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "service": "Exam Ease AI",
        "status": "online",
        "environment": os.getenv("FLASK_ENV", "production")
    }), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

# --- Run Flask ---
if __name__ == "__main__":
    print("Starting Flask server on port 5000...")
    app.run(debug=True, port=5000)
