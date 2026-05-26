import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { apiClient } from "@/lib/api";

// Define the shape of the Emotion type
export type Emotion = "happy" | "sad" | "neutral" | "angry" | "fear" | "disgust" | "surprise" | "unknown" | "no_image";

interface CameraFeedProps {
    isWebcamOn: boolean;
    onEmotionDetected: (emotion: Emotion) => void;
}

const CameraFeed = ({ isWebcamOn, onEmotionDetected }: CameraFeedProps) => {
    const webcamRef = useRef<Webcam>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // Diagnostics
    const isSecureContext = window.isSecureContext;
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const isIframe = window.self !== window.top;
    
    // Log diagnostics on mount
    useEffect(() => {
        console.log("📷 Camera Diagnostics:", {
            href: window.location.href,
            protocol: window.location.protocol,
            isSecureContext,
            hasGetUserMedia,
            isIframe,
            mediaDevices: !!navigator.mediaDevices
        });
    }, [isSecureContext, hasGetUserMedia, isIframe]);

    const handleUserMediaError = useCallback((error: string | DOMException) => {
        console.error("❌ Webcam access denied or failed to start:", error);
        setCameraError(typeof error === 'string' ? error : error.message);
    }, []);

    const handleUserMedia = useCallback((mediaStream: MediaStream) => {
        console.log("✅ Webcam started successfully. Stream:", mediaStream);
        setCameraError(null);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const captureAndDetect = async () => {
            if (!isWebcamOn || !webcamRef.current) return;

            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            setIsAnalyzing(true);
            try {
                const response = await apiClient.post("/detect_emotion", {
                    image: imageSrc,
                });

                const detected = response.data.emotion as Emotion;
                onEmotionDetected(detected);

            } catch (error: any) {
                if (error.isAxiosError) {
                     console.error("❌ API Error reaching backend:", error.message, error.response?.data);
                } else {
                     console.error("❌ Emotion detection unknown error:", error);
                }
            } finally {
                setIsAnalyzing(false);
            }
        };

        // Only start loop if camera is actually supported and rendering
        if (isWebcamOn && hasGetUserMedia) {
            intervalId = setInterval(captureAndDetect, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isWebcamOn, onEmotionDetected, hasGetUserMedia]);

    if (!isWebcamOn) return null;

    // Render diagnostic error if getUserMedia is outright unsupported
    if (!hasGetUserMedia) {
        return (
            <div className="relative w-full flex justify-center items-center bg-black rounded-lg overflow-hidden h-48 sm:h-56 p-4">
                <div className="text-red-400 text-xs flex flex-col gap-2 max-w-full overflow-hidden text-center break-words">
                    <p className="font-bold text-sm text-red-500">Camera Not Supported Here</p>
                    <p><strong>URL:</strong> {window.location.href}</p>
                    {!isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
                        <p className="text-orange-300 border border-orange-400/50 p-2 rounded bg-orange-400/10">
                            ⚠️ <strong>Insecure context detected!</strong> Browsers block camera access on `http://` over a network IP.
                            <br/><br/>
                            Access this app via <strong>http://localhost:{window.location.port || '8080'}</strong> locally, or set up HTTPS.
                        </p>
                    )}
                    {isIframe && (
                        <p className="text-orange-300 border border-orange-400/50 p-2 rounded bg-orange-400/10">
                            ⚠️ <strong>Embedded iframe detected!</strong> The parent frame did not grant `allow="camera"` permissions.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full flex justify-center items-center bg-black rounded-lg overflow-hidden h-48 sm:h-56">
            {cameraError ? (
                <div className="text-red-500 text-xs text-center p-4">
                    Camera Error: {cameraError} <br/> (Check permissions or ensure another app isn't using it)
                </div>
            ) : (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="h-full w-auto object-cover opacity-90"
                    mirrored={true}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                    videoConstraints={{
                        width: 320,
                        height: 240,
                        facingMode: "user",
                    }}
                />
            )}

            {/* Overlay Status */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                {isAnalyzing ? "Analyzing..." : "Live"}
            </div>
        </div>
    );
};

export default CameraFeed;
