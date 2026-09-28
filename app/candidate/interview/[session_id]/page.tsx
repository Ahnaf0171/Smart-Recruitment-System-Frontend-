"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { SkipForward, Clock, Video, Mic, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { API_BASE_URL } from "@/lib/constants";
import { getCookie } from "@/lib/utils";
import { useFetch } from "@/hooks/use-fetch";

type Question = {
  question: string;
};

const MAX_TIME = 120;

const VideoInterview: React.FC = () => {
  const [error, setError] = useState("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [recordings, setRecordings] = useState<Record<number, Blob>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pendingSubmitRef = useRef(false); // Track if we're waiting to submit

  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const sessionId = pathParts[3];

  const {
    data: questions = [],
    loading: loadingQuestions,
    error: fetchError,
  } = useFetch<Question[]>(sessionId ? `/api/find/${sessionId}` : null);

  const submitRecordings = useCallback(
    async (finalRecordings: Record<number, Blob>) => {
      if (isSubmitting) {
        console.log("Submission already in progress");
        return;
      }

      setIsSubmitting(true);
      console.log(
        "submitRecordings called with recordings:",
        Object.keys(finalRecordings).length,
        "videos"
      );

      try {
        console.log("Preparing FormData with recordings:", finalRecordings);
        const formData = new FormData();
        formData.append("session_id", sessionId);

        Object.entries(finalRecordings).forEach(([index, blob]) => {
          formData.append("video", blob, `ques${Number(index) + 1}.webm`);
          console.log(`Appended recording for question ${index}`);
        });

        const token = getCookie("access_token");
        const response = await axios.post(
          `${API_BASE_URL}/api/response/`,
          formData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("✅ Recordings uploaded successfully!", response.data);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        console.log("Stopped all media tracks after submission");

        router.push("/candidate/dashboard");
      } catch (err) {
        console.error("❌ Upload failed:", err);
        setError("Failed to submit recordings. Please try again.");
        setIsSubmitting(false);
      }
    },
    [isSubmitting, sessionId, router]
  );

  const stopRecordingAsync = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (
        !mediaRecorderRef.current ||
        mediaRecorderRef.current.state === "inactive"
      ) {
        console.log("No active recording to stop.");
        resolve(null);
        return;
      }

      console.log("Stopping current recording...");

      const handleStop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        console.log("Recording stopped, blob created:", blob.size, "bytes");
        chunksRef.current = [];
        resolve(blob);
      };

      mediaRecorderRef.current.addEventListener("stop", handleStop, {
        once: true,
      });
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  }, []);

  useEffect(() => {
    const initMedia = async () => {
      try {
        console.log("Initializing media devices...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        console.log("Camera and mic initialized:", stream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setError("Failed to access camera/microphone");
      }
    };

    initMedia();

    return () => {
      console.log("Cleaning up media devices...");
      if (mediaRecorderRef.current?.state === "recording") {
        console.log("Stopping active recording before cleanup...");
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      console.log("Media tracks stopped.");
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) {
      console.log("Cannot start recording: no stream available");
      return;
    }
    if (isRecording) {
      console.log("Already recording, skipping startRecording");
      return;
    }

    console.log("Starting recording for question index:", currentQIndex);
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);

    mediaRecorder.ondataavailable = (e) => {
      console.log("ondataavailable event:", e.data.size, "bytes");
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    // Note: We handle onstop differently now when submitting
    mediaRecorder.onstop = () => {
      console.log("MediaRecorder stopped for question index:", currentQIndex);
      setIsRecording(false);

      // Only update state if we're not about to submit
      if (!pendingSubmitRef.current) {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordings((prev) => {
          const newState = { ...prev, [currentQIndex]: blob };
          console.log("Updated recordings state:", newState);
          return newState;
        });
        chunksRef.current = [];
      }
    };

    mediaRecorder.start();
    console.log("MediaRecorder started. MAX_TIME reset to", MAX_TIME);
    setTimeLeft(MAX_TIME);
  }, [isRecording, currentQIndex]);

  const handleNext = useCallback(async () => {
    console.log("handleNext called. Current question index:", currentQIndex);

    if (questions?.length && currentQIndex === questions?.length - 1) {
      console.log("Last question reached. Stopping and submitting...");
      pendingSubmitRef.current = true;

      // Stop recording and wait for the blob
      const finalBlob = await stopRecordingAsync();

      // Build complete recordings object
      const allRecordings = { ...recordings };
      if (finalBlob) {
        allRecordings[currentQIndex] = finalBlob;
        console.log(
          "Added final recording. Total recordings:",
          Object.keys(allRecordings).length
        );
      }

      // Now submit with ALL recordings including the last one
      await submitRecordings(allRecordings);
    } else {
      console.log("Moving to next question...");

      // Stop current recording and wait for blob
      const blob = await stopRecordingAsync();

      if (blob) {
        setRecordings((prev) => {
          const newState = { ...prev, [currentQIndex]: blob };
          console.log("Updated recordings state:", newState);
          return newState;
        });
      }

      // Move to next question
      setCurrentQIndex((prev) => prev + 1);
    }
  }, [
    currentQIndex,
    questions?.length,
    recordings,
    stopRecordingAsync,
    submitRecordings,
  ]);

  useEffect(() => {
    if (timeLeft <= 0) {
      console.log("Time expired for question:", currentQIndex);
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, handleNext, currentQIndex]);

  useEffect(() => {
    if (!streamRef.current || questions?.length === 0 || isSubmitting) return;

    console.log("Auto-starting recording for question:", currentQIndex);
    const timer = setTimeout(() => {
      startRecording();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentQIndex, questions?.length, startRecording, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = ((MAX_TIME - timeLeft) / MAX_TIME) * 100;

  if (loadingQuestions) return <p>Loading session...</p>;
  if (fetchError) return <p style={{ color: "red" }}>{error}</p>;
  if (questions?.length === 0) return <p>No questions available</p>;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Video Interview"
        description="Answer each question to the best of your ability"
      />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-card rounded-xl shadow-xl overflow-hidden border border-border">
          <div className="p-6 md:p-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                  <span className="text-sm font-bold text-primary">
                    {currentQIndex + 1}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  of {questions?.length}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Video className="w-4 h-4 mr-1" />
                  <span>Camera On</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mic className="w-4 h-4 mr-1" />
                  <span>Mic On</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Question section */}
              <div className="space-y-6">
                <div className="bg-secondary rounded-xl p-5 border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm mr-2">
                      {currentQIndex + 1}
                    </span>
                    Question {currentQIndex + 1}
                  </h2>
                  <p className="text-foreground text-lg">
                    {(questions && questions[currentQIndex]?.question) ||
                      "Loading question..."}
                  </p>
                </div>

                {/* Timer */}
                <div className="bg-muted rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-foreground">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="font-medium">Time remaining</span>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        timeLeft <= 10 ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-border rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-primary transition-all duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Controls */}
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : questions?.length && currentQIndex === questions?.length - 1 ? (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit All Responses
                    </>
                  ) : (
                    <>
                      <SkipForward className="w-5 h-5 mr-2" />
                      Next Question
                    </>
                  )}
                </button>
              </div>

              {/* Video section */}
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-border bg-black aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-destructive mr-2 animate-pulse"></div>
                      <span className="text-white text-sm font-medium">
                        Recording
                      </span>
                    </div>
                  )}
                </div>

                {/* Recording status */}
                <div className="bg-muted rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Question status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        recordings[currentQIndex]
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {recordings[currentQIndex] ? "Recorded" : "Recording..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question navigation */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex justify-center space-x-2">
                {questions?.map((_, index) => (
                  <button
                    key={index}
                    onClick={async () => {
                      if (index !== currentQIndex && !isSubmitting) {
                        const blob = await stopRecordingAsync();
                        if (blob) {
                          setRecordings((prev) => ({
                            ...prev,
                            [currentQIndex]: blob,
                          }));
                        }
                        setCurrentQIndex(index);
                      }
                    }}
                    disabled={isSubmitting}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQIndex
                        ? "bg-primary"
                        : recordings[index]
                        ? "bg-green-500"
                        : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to question ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;
