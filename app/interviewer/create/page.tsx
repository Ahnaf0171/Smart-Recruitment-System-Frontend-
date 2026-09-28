"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Plus, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CreateSessionPayload } from "@/lib/types";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PageHeader } from "@/components/shared/page-header";
import { useMutation } from "@/hooks/use-mutation";
import { createSessionApi } from "@/lib/api/interviewer";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function CreateSessionPage() {
  const [formData, setFormData] = useState<CreateSessionPayload>({
    position: "",
    stacks: [],
    level: "",
    allowed_candidates: [],
    num_questions: 3,
    scheduled: "",
  });
  const [newStack, setNewStack] = useState("");
  const [newCandidate, setNewCandidate] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const router = useRouter();

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? "PM" : "AM";
        options.push({
          value: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          label: `${displayHour}:${minute.toString().padStart(2, "0")} ${amPm}`,
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const addStack = () => {
    if (newStack.trim() && !formData.stacks.includes(newStack.trim())) {
      setFormData((prev) => ({
        ...prev,
        stacks: [...prev.stacks, newStack.trim()],
      }));
      setNewStack("");
    }
  };

  const removeStack = (stack: string) => {
    setFormData((prev) => ({
      ...prev,
      stacks: prev.stacks.filter((s) => s !== stack),
    }));
  };

  const addCandidate = () => {
    const email = newCandidate.trim();
    if (email && !formData.allowed_candidates.includes(email)) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setFormData((prev) => ({
          ...prev,
          allowed_candidates: [...prev.allowed_candidates, email],
        }));
        setNewCandidate("");
        setError("");
      } else {
        setError("Please enter a valid email address");
      }
    }
  };

  const removeCandidate = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      allowed_candidates: prev.allowed_candidates.filter((c) => c !== email),
    }));
  };

  useEffect(() => {
    if (date && time) {
      const [hours, minutes] = time.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));

      setFormData((prev) => ({
        ...prev,
        scheduled: newDate.toISOString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        scheduled: "",
      }));
    }
  }, [date, time]);

  const { mutate: createSession, loading } = useMutation(createSessionApi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.position.trim()) {
      setError("Position title is required");
      return;
    }
    if (formData.stacks.length === 0) {
      setError("At least one technology stack is required");
      return;
    }
    if (!formData.level) {
      setError("Experience level is required");
      return;
    }
    if (formData.allowed_candidates.length === 0) {
      setError("At least one candidate email is required");
      return;
    }
    if (!formData.scheduled) {
      setError("Scheduled date & time is required");
      return;
    }

    createSession(formData, {
      successMessage: "Interview session created successfully!",
      onSuccess: (data) => {
        if (!data) return;
        router.push(`/interviewer/session/${data.Session_ID}`);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <PageHeader
        title="Create Interview Session"
        description="Set up a new interview session with custom questions"
        backLabel="Back to Dashboard"
        backHref="/interviewer/dashboard"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="glass-effect border-sidebar-border shadow-soft animate-slide-in">
          <CardHeader>
            <CardTitle className="font-heading text-foreground">
              Session Details
            </CardTitle>
            <CardDescription className="font-body text-muted-foreground">
              Configure your interview session parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-destructive/15 border-destructive/50 animate-slide-in delay-100"
                >
                  <AlertDescription className="text-destructive-foreground font-body">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 animate-slide-in delay-200">
                <Label htmlFor="position" className="font-body text-foreground">
                  Position Title
                </Label>
                <Input
                  id="position"
                  placeholder="e.g., Frontend Developer, Data Scientist"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="h-11 bg-input border-sidebar-border"
                />
              </div>

              <div className="space-y-2 animate-slide-in delay-300">
                <Label className="font-body text-foreground">
                  Technology Stacks
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., React, Node.js, Python"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addStack())
                    }
                    className="h-11 flex-1 bg-input border-sidebar-border"
                  />
                  <Button
                    type="button"
                    onClick={addStack}
                    className="h-11 px-3 bg-primary text-primary-foreground hover:bg-primary-light shadow-primary animate-scale-in"
                    disabled={!newStack.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.stacks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.stacks.map((stack) => (
                      <Badge
                        key={stack}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-3 font-body bg-secondary/50 text-foreground animate-slide-in delay-400"
                      >
                        {stack}
                        <button
                          type="button"
                          onClick={() => removeStack(stack)}
                          className="ml-1 rounded-full hover:bg-muted/50"
                        >
                          <X className="w-3 h-3 text-primary" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 animate-slide-in delay-500">
                <Label className="font-body text-foreground">
                  Experience Level
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger className="h-11! bg-input border-sidebar-border text-foreground hover:bg-secondary/50 animate-scale-in min-w-55">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-sidebar-border">
                    <SelectItem value="beginner" className="font-body">
                      Beginner (0-2 years)
                    </SelectItem>
                    <SelectItem value="intermediate" className="font-body">
                      Intermediate (2-5 years)
                    </SelectItem>
                    <SelectItem value="advanced" className="font-body">
                      Advanced (5+ years)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 animate-slide-in delay-600">
                <Label
                  htmlFor="num_questions"
                  className="font-body text-foreground"
                >
                  Number of Questions
                </Label>
                <Select
                  value={formData.num_questions.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      num_questions: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-11! bg-input border-sidebar-border text-foreground hover:bg-secondary/50 animate-scale-in min-w-55">
                    <SelectValue placeholder="Select number of questions" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-sidebar-border">
                    <SelectItem value="2" className="font-body">
                      2 Questions
                    </SelectItem>
                    <SelectItem value="3" className="font-body">
                      3 Questions
                    </SelectItem>
                    <SelectItem value="4" className="font-body">
                      4 Questions
                    </SelectItem>
                    <SelectItem value="5" className="font-body">
                      5 Questions
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 animate-slide-in delay-700">
                <Label className="font-body text-foreground">
                  Candidate Emails
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="candidate@example.com"
                    value={newCandidate}
                    onChange={(e) => setNewCandidate(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCandidate())
                    }
                    className="h-11 flex-1 bg-input border-sidebar-border"
                  />
                  <Button
                    type="button"
                    onClick={addCandidate}
                    className="h-11 px-3 bg-primary text-primary-foreground hover:bg-primary-light shadow-primary animate-scale-in"
                    disabled={!newCandidate.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.allowed_candidates.length > 0 && (
                  <div className="space-y-2 mt-2 animate-slide-in delay-800">
                    {formData.allowed_candidates.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between bg-secondary/50 p-3 rounded-md"
                      >
                        <span className="text-sm font-body text-foreground">
                          {email}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCandidate(email)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 animate-slide-in delay-900">
                <Label className="font-body text-foreground">
                  Scheduled Date & Time (Optional)
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="date-picker"
                      className="font-body text-foreground"
                    >
                      Select Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-11 px-3 flex items-center justify-start gap-2 
                     border-sidebar-border text-foreground bg-input
                     hover:bg-secondary/50 hover:text-primary-dark 
                     shadow-soft animate-scale-in"
                        >
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>
                            {date ? format(date, "PPP") : "Pick a date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border-sidebar-border">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Picker */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="time-select"
                      className="font-body text-foreground"
                    >
                      Select Time
                    </Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger
                        className="w-full h-11! px-3 flex items-center justify-start gap-2
                   border-sidebar-border text-foreground bg-input
                   hover:bg-secondary/50 hover:text-primary-dark
                   shadow-soft animate-scale-in"
                      >
                        <Clock className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-sidebar-border">
                        {timeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="font-body"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {date && time && (
                  <div className="p-3 bg-secondary/50 rounded-md animate-slide-in delay-1000">
                    <p className="text-sm text-muted-foreground font-body flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      <strong>Selected:</strong>
                      <span className="ml-1">
                        {format(date, "PPP")} at{" "}
                        {timeOptions.find((opt) => opt.value === time)?.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6 animate-slide-in delay-1100">
                <Button
                  type="button"
                  variant="outline"
                  className="border-sidebar-border text-foreground hover:bg-secondary/50 hover:text-primary-dark shadow-soft animate-scale-in"
                  asChild
                >
                  <Link href="/interviewer/dashboard">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary-light shadow-primary animate-scale-in"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Creating Session...
                    </>
                  ) : (
                    "Create Session"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
