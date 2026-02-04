import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

// Define the shape of the Emotion type
export type Emotion = "happy" | "sad" | "neutral" | "angry" | "fear" | "disgust" | "surprise" | "unknown" | "no_image";

interface CameraFeedProps {
    isWebcamOn: boolean;
    backendUrl: string;
    onEmotionDetected: (emotion: Emotion) => void;
}

const CameraFeed = ({ isWebcamOn, backendUrl, onEmotionDetected }: CameraFeedProps) => {
    const webcamRef = useRef<Webcam>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const captureAndDetect = async () => {
            // Basic checks
            if (!isWebcamOn || !webcamRef.current) return;

            // Capture frame
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            setIsAnalyzing(true);
            try {
                // Send to backend
                const response = await axios.post(`${backendUrl}/detect_emotion`, {
                    image: imageSrc,
                });

                // Backend should return { emotion: "...", status: "success" }
                const detected = response.data.emotion as Emotion;

                // Notify parent component
                onEmotionDetected(detected);

            } catch (error) {
                console.error("❌ Emotion detection error:", error);
            } finally {
                setIsAnalyzing(false);
            }
        };

        if (isWebcamOn) {
            // Run every 1 second
            intervalId = setInterval(captureAndDetect, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isWebcamOn, backendUrl, onEmotionDetected]);

    if (!isWebcamOn) return null;

    return (
        <div className="relative w-full flex justify-center items-center bg-black rounded-lg overflow-hidden h-48 sm:h-56">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="h-full w-auto object-cover opacity-90"
                mirrored={true}
                videoConstraints={{
                    width: 320,
                    height: 240,
                    facingMode: "user",
                }}
            />

            {/* Overlay Status */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                {isAnalyzing ? "Analyzing..." : "Live"}
            </div>
        </div>
    );
};

export default CameraFeed;
