import * as xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";
import Groq from "groq-sdk";

const prisma = new PrismaClient();

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
  console.error("GROQ_API_KEY is not set in the environment.");
  process.exit(1);
}

const groq = new Groq({
  apiKey: groqApiKey,
});

async function analyzeInvestorWithGroq(name: string, email?: string): Promise<{
  inferredSectors: string[];
  investmentStages: string[];
  notablePortfolio: string[];
} | null> {
  const website = email ? email.split("@")[1] : "Unknown";
  
  const prompt = `
You are an expert Venture Capital Analyst. I need you to provide the typical investment profile for the Indian SEBI-registered Alternative Investment Fund named "${name}" (associated domain: ${website}).

Determine:
1. "inferredSectors": An array of strings representing the industries they focus on (e.g., ["Fintech", "Enterprise SaaS", "Consumer", "Deeptech"]). Be specific.
2. "investmentStages": An array of strings representing their preferred investment stages (e.g., ["Seed", "Series A", "Growth"]).
3. "notablePortfolio": An array of strings with 1 to 5 notable portfolio companies they have backed.

If you don't have concrete data on them because they are very obscure, provide the best educated guess based on their name and typical Indian VC patterns, but keep it broad.

Return ONLY a valid JSON object matching this schema exactly:
{
  "inferredSectors": ["sector1", "sector2"],
  "investmentStages": ["stage1", "stage2"],
  "notablePortfolio": ["company1", "company2"]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert VC Analyst. Output ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to analyze ${name} with Groq:`, error);
    return null;
  }
}

async function main() {
  console.log("Loading Excel file...");
  // Path to the SEBI database
  const filePath = "data/AIF Database SEBI-2 (1).xlsx";
  const workbook = xlsx.readFile(filePath);
  
  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const rawData = xlsx.utils.sheet_to_json(sheet) as Array<Record<string, any>>;
  
  console.log(`Found ${rawData.length} rows in the Excel file.`);
  
  // To avoid blowing up the API limit, let's limit to 100 records for this test run.
  const limit = 100;
  const dataToProcess = rawData.slice(0, limit);
  
  console.log(`Processing first ${dataToProcess.length} records...`);

  for (const row of dataToProcess) {
    const name = row["Name"] || row["name"] || row["NAME"];
    const registeredNumber = row["Registered Number"] || row["registered Number"] || row["Registered_Number"];
    const email = row["E-Mail"] || row["Email"] || row["e-mail"];
    
    if (!name) {
      console.warn("Skipping row with no name:", row);
      continue;
    }

    const website = email ? email.split("@")[1] : undefined;

    console.log(`\nAnalyzing: ${name} (Domain: ${website || "N/A"})`);
    
    const analysis = await analyzeInvestorWithGroq(name, email);
    
    let inferredSectors: string[] = [];
    let investmentStages: string[] = [];
    let notablePortfolio: string[] = [];
    
    if (analysis) {
      inferredSectors = analysis.inferredSectors || [];
      investmentStages = analysis.investmentStages || [];
      notablePortfolio = analysis.notablePortfolio || [];
    }

    console.log("Result:", { inferredSectors, investmentStages, notablePortfolio });

    // Save to database
    try {
      if (registeredNumber) {
        await prisma.investor.upsert({
          where: { registeredNumber },
          update: {
            name, email, website, inferredSectors, investmentStages, notablePortfolio
          },
          create: {
            name, registeredNumber, email, website, inferredSectors, investmentStages, notablePortfolio
          }
        });
      } else {
        await prisma.investor.create({
            data: { name, email, website, inferredSectors, investmentStages, notablePortfolio }
        });
      }
      console.log(`Saved ${name} to database.`);
    } catch (e) {
      console.error(`Database error for ${name}:`, e);
    }
    
    // Add a small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\nDone!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
