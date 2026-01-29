
export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}

export enum IssueSeverity {
  CRITICAL = 'Critical',
  MODERATE = 'Moderate',
  SUGGESTION = 'Suggestion',
}

export interface Issue {
  severity: IssueSeverity;
  title: string;
  description: string;
}

export interface AnalysisResult {
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
  totalMistakes: number;
  summary: string;
  issues: Issue[];
  improvements: string[];
  keywords: string[];
  fileName: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  atsScore: number;
  fullResult: AnalysisResult;
}
