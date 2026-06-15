import threading
import cv2
from deepface import DeepFace
from fer.fer import FER

try:
    import mediapipe as mp
except Exception:
    mp = None

class ModelManager:
    """
    Thread-safe Singleton Manager for all Heavy ML Models.
    Ensures models are only loaded once and prevents duplicate
    memory allocation during simultaneous first-requests.
    """
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.face_cascade = None
        self.mediapipe_detector = None
        self.fer_detector = None
        self._initialized = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def initialize_models(self):
        """
        Lazy-loads all ML models. Uses double-checked locking
        to prevent race conditions without adding locking overhead
        to subsequent requests.
        """
        # Fast path: already initialized
        if self._initialized:
            return

        with self._lock:
            # Double-check inside lock
            if self._initialized:
                return
            
            print("⏳ [ModelManager] Starting lazy initialization of ML models...")
            
            # 1. Haar Cascade (Lightweight)
            haar_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            try:
                self.face_cascade = cv2.CascadeClassifier(haar_path)
                if self.face_cascade.empty():
                    print(f"❌ [ModelManager] Failed to load Haar cascade from {haar_path}.")
                    self.face_cascade = None
                else:
                    print("✅ [ModelManager] Haar cascade loaded.")
            except Exception as e:
                print(f"❌ [ModelManager] Error loading Haar cascade: {e}")
                self.face_cascade = None

            # 2. MediaPipe Face Detection (Moderate)
            if mp:
                try:
                    self.mediapipe_detector = mp.solutions.face_detection.FaceDetection(
                        model_selection=0, min_detection_confidence=0.35
                    )
                    print("✅ [ModelManager] MediaPipe face detector ready.")
                except Exception as e:
                    self.mediapipe_detector = None
                    print(f"❌ [ModelManager] MediaPipe face detector init failed: {e}")

            # 3. DeepFace Emotion Model (Extremely Heavy)
            try:
                print("⏳ [ModelManager] Warming up DeepFace emotion model (TensorFlow)...")
                DeepFace.build_model("Emotion")
                print("✅ [ModelManager] DeepFace emotion model ready.")
            except Exception as e:
                print(f"❌ [ModelManager] Error warming DeepFace model: {e}")

            # 4. FER Detector with MTCNN (Extremely Heavy)
            try:
                print("⏳ [ModelManager] Warming up FER detector (MTCNN)...")
                self.fer_detector = FER(mtcnn=True)
                print("✅ [ModelManager] FER emotion detector initialized.")
            except Exception as e:
                self.fer_detector = None
                print(f"❌ [ModelManager] Error initializing FER detector: {e}")

            # Mark as fully initialized even if some failed to prevent infinite retry loops
            # (Individual failures are handled gracefully by fallback logic in app.py)
            self._initialized = True
            print("✅ [ModelManager] All models processed.")

# Global instance getter
def get_model_manager():
    return ModelManager.get_instance()
