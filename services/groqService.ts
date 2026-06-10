import Groq from "groq-sdk";
import * as pdfjs from 'pdfjs-dist';
import { AnalysisResult, IssueSeverity } from "../types";

// Initialize pdfjs worker
// Use a CDN for the worker to avoid complex build setup
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

const ANALYSIS_PROMPT = `Analyze this resume as an expert recruiter and Applicant Tracking System (ATS). 
Provide a detailed analysis in JSON format following this exact schema:

{
  "atsScore": number (0-100),
  "grammarScore": number (0-100),
  "formattingScore": number (0-100),
  "totalMistakes": number,
  "summary": "brief executive summary",
  "issues": [
    {
      "severity": "Critical" | "Moderate" | "Suggestion",
      "title": "short title",
      "description": "detailed description"
    }
  ],
  "improvements": ["string"],
  "keywords": ["top 5-10 keywords"]
}

Be strict but constructive. Ensure your evaluation is consistent and based on industry standards.`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
};

export const analyzeResume = async (file: File): Promise<AnalysisResult> => {
  try {
    let content: any[] = [];
    let model = "llama-3.3-70b-versatile";

    if (file.type === "application/pdf") {
      const text = await extractTextFromPDF(file);
      content = [
        {
          role: "user",
          content: `${ANALYSIS_PROMPT}\n\nResume Content:\n${text}`,
        },
      ];
    } else if (file.type.startsWith("image/")) {
      model = "llama-3.2-11b-vision-preview";
      const base64 = await helperFileToBase64(file);
      content = [
        {
          role: "user",
          content: [
            { type: "text", text: ANALYSIS_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64}`,
              },
            },
          ],
        },
      ];
    } else {
      throw new Error("Unsupported file type");
    }

    const response = await groq.chat.completions.create({
      model: model,
      messages: content,
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error("No response from Groq");
    }

    const parsedData = JSON.parse(resultText);

    return {
      ...parsedData,
      fileName: file.name,
      keywords: parsedData.keywords || [],
      issues: (parsedData.issues || []).map((issue: any) => ({
        ...issue,
        severity: Object.values(IssueSeverity).includes(issue.severity)
          ? issue.severity
          : IssueSeverity.SUGGESTION,
      })),
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const helperFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
