import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RecruiterProfile } from "@/types/company";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export function sanitizeUrl(url: string) {
  const trimmed = url.trim();
  return trimmed.replace(/\s+/g, "");
}

export function toRecruiterArray(value: unknown): RecruiterProfile[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        const name = item.trim();
        return name ? { name, linkedinUrl: "" } : null;
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const name = String(record.name ?? "").trim();
      const linkedinUrl = String(record.linkedinUrl ?? "").trim();

      if (!name) {
        return null;
      }

      return {
        name,
        linkedinUrl,
      };
    })
    .filter((entry): entry is RecruiterProfile => Boolean(entry));
}
