import Groq from "groq-sdk";
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { AnalysisResult, IssueSeverity } from "../types";

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

const ANALYSIS_PROMPT = `Analyze this resume as an expert recruiter and Applicant Tracking System (ATS). 
The input text provided is raw text extracted from a document. Please ignore minor spacing, alignment, or line-break artifacts caused by the extraction process.

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

Evaluation Guidelines:
1. Be strict but constructive, focusing on content, impact, and professional standards.
2. Contact Information: Only flag as "Critical" if essential information (Name, Email, or Phone) is missing or blatantly unprofessional. Do NOT penalize the layout or order of contact details, as these are often jumbled during text extraction.
3. Formatting: Evaluate logical formatting (consistent dates, clear section headers, bullet point usage) rather than visual alignment.
4. Summary: Provide a concise, professional overview of the candidate's profile.
5. ATS Compatibility: Check for the presence of standard sections and relevant keywords.`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    let lastY = -1;
    let pageText = "";
    
    // Sort items by Y (top to bottom) and then X (left to right)
    // In PDF coordinates, Y increases from bottom to top, so we sort Y descending.
    const items = [...textContent.items as any[]].sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5];
      if (Math.abs(yDiff) > 5) return yDiff;
      return a.transform[4] - b.transform[4];
    });
    
    for (const item of items) {
      const currentY = item.transform[5];
      
      if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
        pageText += "\n";
      } else if (lastY !== -1) {
        // Only add space if there's actual content and it doesn't already end/start with one
        if (pageText.length > 0 && !pageText.endsWith(" ") && !item.str.startsWith(" ")) {
          pageText += " ";
        }
      }
      
      pageText += item.str;
      lastY = currentY;
    }
    
    fullText += pageText + "\n\n";
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
