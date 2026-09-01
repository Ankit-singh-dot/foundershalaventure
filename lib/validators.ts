import { z } from "zod";

export const websiteSchema = z.object({
  website: z
    .string()
    .trim()
    .min(3, "Website URL is required")
    .transform((val) => {
      if (!val.startsWith("http://") && !val.startsWith("https://")) {
        return `https://${val}`;
      }
      return val;
    })
    .refine((val) => {
      try {
        const parsed = new URL(val);
        // Ensure hostname has a dot and valid format
        return parsed.hostname.includes(".") && parsed.hostname.split(".")[1]?.length >= 2;
      } catch {
        return false;
      }
    }, "Please enter a valid company website URL (e.g., https://yourcompany.com)"),
});

export const valuationInputSchema = z.object({
  website: z.string().url("Valid website URL required"),
  companyName: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  revenue2025: z.coerce.number().min(0, "Revenue must be a positive number"),
  preTaxProfit: z.coerce.number(),
  ownerSalary: z.coerce.number().min(0, "Owner salary must be a positive number"),
  targetValuation: z.coerce.number().optional().default(50), // Default 50 Cr if empty
  targetDilution: z.coerce.number().optional().default(10), // Default 10% if empty
});

export const dealLeadSchema = z.object({
  founderName: z.string().min(2, "Founder name is required"),
  email: z.string().email("Valid work email is required"),
  phone: z.string().min(8, "Valid contact number is required"),
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().min(3, "Website URL is required"),
  linkedin: z.string().optional().default(""),
  revenue2025: z.coerce.number().optional().default(0),
  preTaxProfit: z.coerce.number().optional().default(0),
  
  // 5 Pitch deliverables links or filenames
  pitchDeckFileName: z.string().optional().default(""),
  infoMemoFileName: z.string().optional().default(""),
  financialModelFileName: z.string().optional().default(""),
  valuationReportFileName: z.string().optional().default(""),
  videoPitchUrl: z.string().optional().default(""),

  requestedServices: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(""),
});
