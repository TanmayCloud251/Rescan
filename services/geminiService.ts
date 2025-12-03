import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, IssueSeverity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema definition for structured JSON output
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    atsScore: { type: Type.NUMBER, description: "Overall ATS compatibility score from 0 to 100" },
    grammarScore: { type: Type.NUMBER, description: "Grammar and spelling score from 0 to 100" },
    formattingScore: { type: Type.NUMBER, description: "Layout and formatting score from 0 to 100" },
    totalMistakes: { type: Type.NUMBER, description: "Count of distinct errors found" },
    summary: { type: Type.STRING, description: "A brief executive summary of the resume quality" },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, enum: ["Critical", "Moderate", "Suggestion"] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["severity", "title", "description"],
      },
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific actionable steps to improve the resume"
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of top 5-10 keywords found in the resume or recommended to be added."
    }
  },
  required: ["atsScore", "grammarScore", "formattingScore", "totalMistakes", "summary", "issues", "improvements", "keywords"],
};

export const analyzeResume = async (fileBase64: string, mimeType: string, fileName: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64,
            },
          },
          {
            text: `Analyze this resume as an expert recruiter and Applicant Tracking System (ATS). 
            Provide a detailed analysis including an ATS score, grammar check, formatting review, and specific actionable feedback.
            Identify key hard and soft skills present or missing as 'keywords'.
            Be strict but constructive.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
        throw new Error("No response from Gemini");
    }
    
    const parsedData = JSON.parse(resultText);

    // Map the parsed data to our internal interface to ensure type safety
    return {
        ...parsedData,
        fileName,
        keywords: parsedData.keywords || [],
        // Ensure enum mapping is correct (basic validation)
        issues: parsedData.issues.map((issue: any) => ({
            ...issue,
            severity: Object.values(IssueSeverity).includes(issue.severity) ? issue.severity : IssueSeverity.SUGGESTION
        }))
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
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};