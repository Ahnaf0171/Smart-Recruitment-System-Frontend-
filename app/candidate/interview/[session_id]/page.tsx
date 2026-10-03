"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { SkipForward, Clock, Video, Mic, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { API_BASE_URL } from "@/lib/constants";
import { getCookie } from "@/lib/utils";
import { useFetch } from "@/hooks/use-fetch";
import InterviewNotStartedModal from "@/components/shared/interview-not-started-modal";

type Question = {
  question: string;
};

const MAX_TIME = 240;

const VideoInterview: React.FC = () => {
  const [cameraError, setCameraError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
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
  const busyRef = useRef(false); // double handleNext (button + timer) block korar jonno

  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const sessionId = pathParts[3];

  const {
    data: questions,
    loading: loadingQuestions,
    error: fetchError,
    errorData,
  } = useFetch<Question[]>(sessionId ? `/api/find/${sessionId}` : null);

  /* ---------- Camera init ---------- */
  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        setStream(s);
      })
      .catch((err) => {
        console.error("Media error:", err.name, err.message);
        setCameraError(
          err.name === "NotAllowedError"
            ? "Camera/microphone permission blocked. Browser settings theke Allow koro."
            : err.name === "NotReadableError"
              ? "Camera onno kono app/tab use korche. Segulo bondho kore reload koro."
              : err.name === "NotFoundError"
                ? "Kono camera ba microphone pawa jayni."
                : "Failed to access camera/microphone",
        );
      });

    return () => {
      cancelled = true;
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // <video> element questions load hoyar pore mount hoy, tai stream ekhane attach hobe
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, questions, loadingQuestions]);

  /* ---------- Submit ---------- */
  const submitRecordings = useCallback(
    async (finalRecordings: Record<number, Blob>) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError("");

      try {
        const formData = new FormData();
        formData.append("session_id", sessionId);

        // index order e append, jate backend e question order thik thake
        Object.keys(finalRecordings)
          .map(Number)
          .sort((a, b) => a - b)
          .forEach((index) => {
            formData.append(
              "video",
              finalRecordings[index],
              `ques${index + 1}.webm`,
            );
          });

        const token = getCookie("access_token");
        await axios.post(`${API_BASE_URL}/api/response/`, formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        });

        streamRef.current?.getTracks().forEach((t) => t.stop());
        router.push("/candidate/dashboard");
      } catch (err) {
        console.error("Upload failed:", err);
        setSubmitError("Failed to submit recordings. Please try again.");
        setIsSubmitting(false);
        busyRef.current = false;
      }
    },
    [isSubmitting, sessionId, router],
  );

  /* ---------- Recording ---------- */
  // Blob toiri ekhanei hoy (single source), onstop e ar blob banano hoy na
  const stopRecordingAsync = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve(null);
        return;
      }

      recorder.addEventListener(
        "stop",
        () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          chunksRef.current = [];
          setIsRecording(false);
          resolve(blob);
        },
        { once: true },
      );
      recorder.stop();
    });
  }, []);

  const startRecording = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    if (mediaRecorderRef.current?.state === "recording") return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(s);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.start();
    setIsRecording(true);
    setTimeLeft(MAX_TIME);
  }, []);

  const handleNext = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    const blob = await stopRecordingAsync();
    const isLast =
      !!questions?.length && currentQIndex === questions.length - 1;

    if (isLast) {
      const allRecordings = { ...recordings };
      if (blob) allRecordings[currentQIndex] = blob;
      await submitRecordings(allRecordings); // busyRef fail hole submit er catch e reset hoy
    } else {
      if (blob) {
        setRecordings((prev) => ({ ...prev, [currentQIndex]: blob }));
      }
      setCurrentQIndex((prev) => prev + 1);
      busyRef.current = false;
    }
  }, [
    currentQIndex,
    questions?.length,
    recordings,
    stopRecordingAsync,
    submitRecordings,
  ]);

  // Camera ready + questions loaded hole auto-start
  useEffect(() => {
    if (!stream || !questions?.length || isSubmitting) return;
    const timer = setTimeout(startRecording, 100);
    return () => clearTimeout(timer);
  }, [currentQIndex, questions?.length, stream, startRecording, isSubmitting]);

  // Timer sudhu recording cholar somoy chole
  useEffect(() => {
    if (!isRecording) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isRecording, handleNext]);

  /* ---------- Render ---------- */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = ((MAX_TIME - timeLeft) / MAX_TIME) * 100;

  if (loadingQuestions) return <p>Loading session...</p>;

  if (errorData?.code === "INTERVIEW_NOT_STARTED") {
    return (
      <InterviewNotStartedModal
        open
        scheduledTime={errorData.scheduled_time}
        startsIn={errorData.starts_in}
      />
    );
  }

  if (fetchError) {
    return <p style={{ color: "red" }}>{fetchError}</p>;
  }

  if (!questions || questions.length === 0) {
    return <p>No questions available</p>;
  }

  if (cameraError) {
    return <p style={{ color: "red" }}>{cameraError}</p>;
  }

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
                  of {questions.length}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Video className="w-4 h-4 mr-1" />
                  <span>{stream ? "Camera On" : "Starting camera..."}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mic className="w-4 h-4 mr-1" />
                  <span>{stream ? "Mic On" : "Starting mic..."}</span>
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
                    {questions[currentQIndex]?.question ||
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

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                {/* Controls */}
                <button
                  onClick={handleNext}
                  disabled={isSubmitting || !isRecording}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : currentQIndex === questions.length - 1 ? (
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
                    playsInline
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
                        recordings[currentQIndex] && !isRecording
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {isRecording
                        ? "Recording..."
                        : recordings[currentQIndex]
                          ? "Recorded"
                          : "Waiting..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question navigation (sudhu indicator, click kore jump kora jabe na) */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex justify-center space-x-2">
                {questions.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQIndex
                        ? "bg-primary"
                        : recordings[index]
                          ? "bg-green-500"
                          : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Question ${index + 1}`}
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
