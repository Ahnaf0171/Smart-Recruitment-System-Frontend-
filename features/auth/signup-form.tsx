"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Users, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { showError } from "@/lib/toast";
import { useMutation } from "@/hooks/use-mutation";
import { signupApi } from "@/lib/api/auth";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    company: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "candidate" as "candidate" | "interviewer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { mutate: signup, loading } = useMutation(signupApi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Full Name validation
    const fullName = formData.username.trim();

    if (fullName.length > 50) {
      showError("Full Name must be 50 characters or less");
      return;
    }

    if (fullName.length === 0) {
      showError("Please enter your full name");
      return;
    }

    // Mobile number validation
    const phoneRegex = /^01\d{9}$/;

    if (!phoneRegex.test(formData.phone)) {
      showError("Please enter your mobile number like 01617533441");
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    signup(
      {
        role: formData.role,
        username: fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company: formData.company,
      },
      {
        successMessage: "Signup successful 🎉",
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3 animate-slide-in delay-200">
        <RadioGroup
          value={formData.role}
          onValueChange={(value) => handleInputChange("role", value)}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem
              value="candidate"
              id="candidate"
              className="peer sr-only"
            />
            <Label
              htmlFor="candidate"
              className="flex items-center justify-start rounded-md border-2 border-border bg-background p-4 hover:bg-secondary/50 hover:text-primary-dark peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
            >
              <Users className="hidden sm:flex h-6 w-6 text-primary mr-2" />
              <div className="text-center font-body">
                <div className="font-medium">Candidate</div>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="interviewer"
              id="interviewer"
              className="peer sr-only"
            />
            <Label
              htmlFor="interviewer"
              className="flex items-center justify-start rounded-md border-2 border-border bg-background p-4 hover:bg-secondary/50 hover:text-primary-dark peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
            >
              <UserCheck className="hidden sm:flex h-6 w-6 text-primary mr-2" />
              <div className="text-center font-body">
                <div className="font-medium">Interviewer</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 animate-slide-in delay-300">
        <Label htmlFor="username" className="text-foreground font-body">
          Full Name
        </Label>

        <Input
          id="username"
          type="text"
          placeholder="Enter your full name"
          value={formData.username}
          maxLength={50}
          onChange={(e) => handleInputChange("username", e.target.value)}
          required
          className="h-11 bg-input border-border"
        />

        <p className="text-xs text-muted-foreground">Maximum 50 characters</p>
      </div>

      {formData.role === "interviewer" && (
        <div className="space-y-2 animate-slide-in delay-300">
          <Label htmlFor="company" className="text-foreground font-body">
            Company Name
          </Label>

          <Input
            id="company"
            type="text"
            placeholder="Enter your company name"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            required
            className="h-11 bg-input border-border"
          />
        </div>
      )}

      <div className="space-y-2 animate-slide-in delay-400">
        <Label htmlFor="email" className="text-foreground font-body">
          Email Address
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          className="h-11 bg-input border-border"
        />
      </div>

      <div className="space-y-2 animate-slide-in delay-500">
        <Label htmlFor="phone" className="text-foreground font-body">
          Phone Number
        </Label>

        <Input
          id="phone"
          type="tel"
          placeholder="01617533441"
          value={formData.phone}
          maxLength={11}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
          className="h-11 bg-input border-border"
        />

        <p className="text-xs text-muted-foreground">
          Enter 11 digits, e.g. 01617533441
        </p>
      </div>

      <div className="space-y-2 animate-slide-in delay-600">
        <Label htmlFor="password" className="text-foreground font-body">
          Password
        </Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            className="h-11 bg-input border-border pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2 animate-slide-in delay-700">
        <Label htmlFor="confirmPassword" className="text-foreground font-body">
          Confirm Password
        </Label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            required
            className="h-11 bg-input border-border pr-10"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base bg-primary text-primary-foreground hover:bg-primary-light shadow-primary animate-scale-in delay-800"
        disabled={loading}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};

export default SignupForm;
