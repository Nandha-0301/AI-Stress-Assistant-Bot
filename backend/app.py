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
from deepface import DeepFace
from fer.fer import FER

try:
    import mediapipe as mp
except Exception:
    mp = None

# --- Load env and configuration ---
load_dotenv()

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # hides INFO & WARNING logs
 
app = Flask(__name__)
# Enable CORS for all routes (important for /detect_emotion)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Configurable thresholds (can be overridden in .env) ---
FER_CONFIDENCE_THRESHOLD = float(os.getenv("FER_CONFIDENCE_THRESHOLD", "0.25"))
DEEPFACE_CONFIDENCE_THRESHOLD = float(os.getenv("DEEPFACE_CONFIDENCE_THRESHOLD", "0.30"))
EMOTION_HISTORY_SIZE = int(os.getenv("EMOTION_HISTORY_SIZE", "5"))

# --- Initialize Groq client safely ---
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

# --- Load / warm-up DeepFace models and Haar cascade ---
haar_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
try:
    face_cascade = cv2.CascadeClassifier(haar_path)
    if face_cascade.empty():
        print(f"❌ Failed to load Haar cascade from {haar_path}. Face detection disabled.")
        face_cascade = None
    else:
        print(f"✅ Haar cascade loaded from {haar_path}.")
except Exception as e:
    print(f"❌ Error loading Haar cascade: {e}")
    face_cascade = None

mediapipe_detector = None
if mp:
    try:
        mediapipe_detector = mp.solutions.face_detection.FaceDetection(
            model_selection=0, min_detection_confidence=0.35
        )
        print("✅ MediaPipe face detector ready.")
    except Exception as e:
        mediapipe_detector = None
        print(f"❌ MediaPipe face detector init failed: {e}")

try:
    print("⏳ Warming up DeepFace emotion model...")
    DeepFace.build_model("Emotion")
    print("✅ DeepFace emotion model ready.")
except Exception as e:
    print(f"❌ Error warming DeepFace model: {e}")

try:
    fer_detector = FER(mtcnn=True)
    print("✅ FER emotion detector initialized.")
except Exception as e:
    fer_detector = None
    print(f"❌ Error initializing FER detector: {e}")

# --- Bot persona ---
SYSTEM_PROMPT = """
You are Exam Ease, a supportive and empathetic chatbot designed to help students in India manage the stress of exams (like board exams, university finals, JEE, NEET, etc.).
Your personality is calm, encouraging, and understanding. You are a supportive peer, not a therapist.
Keep responses concise, friendly, and easy to read.
Never give medical advice. If a user expresses thoughts of self-harm, your ONLY goal is to provide the KIRAN Mental Health Helpline number (1800-599-0019) and encourage them to call.
"""

chat_history = [
    {"role": "system", "content": SYSTEM_PROMPT},
    {"role": "assistant", "content": "Hello! I'm Exam Ease, your friendly support bot. Exam season can be tough, but you're not alone. What's on your mind today?"}
]

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
    if not mediapipe_detector:
        return None

    rgb_frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = mediapipe_detector.process(rgb_frame)
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
        if fer_detector:
            try:
                # FER requires RGB usually, but accepts BGR if configured. Let's pass RGB.
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                fer_results = fer_detector.detect_emotions(rgb_frame)
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
@app.route("/detect_emotion", methods=["POST", "OPTIONS"])
def detect_emotion():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

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
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        user_message = data.get("message")
        current_emotion = data.get("currentEmotion", "neutral") # Frontend passes this now

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        chat_history.append({"role": "user", "content": user_message})

        if client:
            # Add emotion context silently
            augmented_history = chat_history + [
                {"role": "system", "content": f"(Context: User seems {current_emotion})"}
            ]
            try:
                response = client.chat.completions.create(messages=augmented_history, model="llama-3.1-8b-instant")
                bot_reply = response.choices[0].message.content
            except Exception as e:
                print(f"❌ Error calling Groq LLM: {e}")
                bot_reply = "Sorry, I'm having trouble generating a reply right now."
        else:
            bot_reply = "Hello — offline mode. I can't access the LLM. " + user_message[:300]

        chat_history.append({"role": "assistant", "content": bot_reply})

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print(f"❌ Error in /chat: {e}")
        return jsonify({"error": "Internal server error."}), 500

# --- Run Flask ---
if __name__ == "__main__":
    print("Starting Flask server on port 5000...")
    app.run(debug=True, port=5000)
