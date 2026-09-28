"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Level = "beginner" | "intermediate" | "advanced" | string;

interface LevelBadgeProps {
  level: Level;
  icon?: boolean;
  children?: ReactNode;
  className?: string;
}

const levelStyles: Record<
  string,
  { className: string; iconClass: string }
> = {
  beginner: {
    className: "bg-green-100 text-green-700 border-green-200",
    iconClass: "fill-green-500 text-green-500",
  },
  intermediate: {
    className: "bg-amber-100 text-amber-700 border-amber-200",
    iconClass: "fill-amber-500 text-amber-500",
  },
  advanced: {
    className: "bg-red-100 text-red-700 border-red-200",
    iconClass: "fill-red-500 text-red-500",
  },
};

export function LevelBadge({
  level,
  icon = true,
  children,
  className,
}: LevelBadgeProps) {
  const normalizedLevel = level?.toLowerCase();
  const style = levelStyles[normalizedLevel] ?? {
    className: "bg-slate-100 text-slate-700 border-slate-200",
    iconClass: "fill-slate-500 text-slate-500",
  };

  return (
    <Badge
      className={cn(
        "px-3 py-1 font-medium inline-flex items-center gap-1",
        style.className,
        className
      )}
    >
      {icon && (
        <Star className={cn("w-4 h-4", style.iconClass)} />
      )}

      {children ?? level}
    </Badge>
  );
}
