"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, LogOut } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logos/logo_icon.png";
import { useRouter } from "next/navigation";
import { clearCookie, getCookie } from "@/lib/utils";

interface PageHeaderProps {
  title?: string;
  description?: string;
  welcomeText?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: ReactNode;
  backLabel?: string;
  backHref?: string;
  backIcon?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  welcomeText,
  actionLabel,
  actionHref,
  actionIcon,
  backLabel,
  backHref,
  backIcon,
  children,
}: PageHeaderProps) {
  const router = useRouter();
  const handleLogout = () => {
    clearCookie("access_token");
    clearCookie("user_role");
    clearCookie("user_name");
    router.push("/login");
  };
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Left Side */}
          <div className="flex gap-2 items-center">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo}
                alt="logo"
                width={1000}
                height={1000}
                className="object-cover w-auto m-auto h-12 md:h-14 animate-fade-in"
                priority
              />
            </Link>
            <div>
              {title && (
                <h1 className="text-xl md:text-3xl font-heading font-bold text-foreground">
                  {title}
                </h1>
              )}
              {description && (
                <p className="hidden md:flex text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {welcomeText && (
              <span className="text-sm text-muted-foreground hidden md:flex">
                {welcomeText}
              </span>
            )}
            {backLabel && backHref && (
              <Button variant="secondary" size="sm" asChild className="group">
                <Link href={backHref}>
                  {backIcon ?? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:border" />
                  )}
                  <span className="hidden md:flex">{backLabel}</span>
                </Link>
              </Button>
            )}
            {actionLabel && actionHref && (
              <Button asChild size="sm">
                <Link href={actionHref}>
                  {actionIcon ?? <Plus className="w-4 h-4 md:mr-2" />}
                  <span className="hidden md:flex">{actionLabel}</span>
                </Link>
              </Button>
            )}
            {children}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut /> <span className="hidden md:flex">Logout</span>{" "}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
