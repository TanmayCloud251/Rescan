## Rescan: An ML-Powered ATS Optimization System

Project Overview

Rescan is a project focused on developing a smart, data-driven tool to help job seekers bypass the automated screening phase of hiring. Applicant Tracking Systems (ATS) automatically filter over 75% of resumes; Rescan bridges this gap by providing objective, actionable feedback to maximize a resume's compatibility and professional quality.


✨ Key Features

Rescan translates complex machine learning analysis into simple, quantifiable metrics and clear instructions for the user.

ATS Compatibility Score (0-100): A calculated metric representing the resume's machine-readability and keyword relevance.

Detailed Error Detection: Identifies granular, critical mistakes across three pillars:

Keywords: Missing high-value skills and low TF-IDF scores.

Grammar/Clarity: Passive voice, vague language, and structural issues.

Formatting: Inconsistent date formats, unreadable section headers, and contact information validation.

Actionable Improvement Plan: An auto-generated checklist that provides prescriptive steps (e.g., "Quantify Achievements," "Use Active Voice") to raise the score.

Historical Tracking: Allows users to track score improvements across multiple resume versions over time.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GROQ_API_KEY` in [.env.local](.env.local) to your Groq API key
3. Run the app:
   `npm run dev`
