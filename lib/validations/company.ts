import { z } from "zod";
import { sanitizeUrl } from "@/lib/utils";

const secureUrl = z
  .string()
  .trim()
  .min(1, "URL is required")
  .refine((value) => {
    const sanitized = sanitizeUrl(value);
    try {
      const parsed = new URL(sanitized);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, {
    message: "Please provide a valid URL",
  })
  .transform(sanitizeUrl)
  .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
    message: "URL must start with http:// or https://",
  });

const tagsArray = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((items) => items.map((item) => item.trim()).filter(Boolean));

const recruiterSchema = z.object({
  name: z.string().trim().min(2, "Recruiter name is required"),
  linkedinUrl: secureUrl,
});

export const companySchema = z.object({
  name: z.string().trim().min(2, "Company name is required"),
  website: secureUrl,
  linkedinUrl: secureUrl,
  cities: tagsArray,
  recruiters: z.array(recruiterSchema).default([]),
});

export type CompanySchemaInput = z.input<typeof companySchema>;
export type CompanySchema = z.output<typeof companySchema>;
