"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@/hooks/use-mutation";
import { loginApi } from "@/lib/api/auth";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { setCookie } from "@/lib/utils";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: login, loading, error } = useMutation(loginApi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { email, password },
      {
        successMessage: "Login successful",
        onSuccess: (data) => {
          if (!data) return;
          setCookie("access_token", data.access);
          setCookie("refresh_token", data.refresh);
          setCookie("user_role", data.role);
          setCookie("user_name", data.username);
          router.push(`/${data.role}/dashboard`);
        },
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 animate-slide-in delay-200">
          <Label htmlFor="email" className="text-foreground font-body">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-input border-border"
          />
        </div>

        <div className="space-y-2 animate-slide-in delay-300">
          <Label htmlFor="password" className="text-foreground font-body">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <Button
          type="submit"
          className="w-full h-11 text-base bg-primary text-primary-foreground hover:bg-primary-light shadow-primary animate-scale-in delay-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </>
  );
}
