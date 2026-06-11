import { GoogleGenerativeAI } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!_genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "placeholder";
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
};

export type AgentMode = 'researcher' | 'coach' | 'strategist' | 'writer' | 'planner' | 'productivity' | 'knowledge' | 'review' | 'default';

const getSystemPrompt = (mode: AgentMode, contextStr: string = "") => {
  let modePrompt = "";
  
  switch (mode) {
    case 'researcher':
      modePrompt = "You are CorTeX.ai Research Agent. Analyze notes, projects, and the knowledge graph to surface missing information, weakly explored topics, and research opportunities. Proactively connect dots.";
      break;
    case 'coach':
    case 'productivity':
      modePrompt = "You are CorTeX.ai Productivity Agent. Monitor focus patterns, goals, and habits. Detect anomalies (e.g. Friday drops, burnout risks) and proactively recommend schedule adjustments. ALL INSIGHTS MUST BE STRICTLY BASED ON DATA. Do not give generic motivational text. Reference historical trends, patterns, and velocity changes.";
      break;
    case 'strategist':
    case 'planner':
      modePrompt = "You are CorTeX.ai Planning Agent. Convert user goals into execution systems. Build schedules, generate milestones, and create task sequences automatically. Foresee risks in project timelines using historical data.";
      break;
    case 'knowledge':
      modePrompt = "You are CorTeX.ai Knowledge Agent. Your job is to connect notes, suggest links, discover patterns, and surface forgotten knowledge to actively improve the user's second brain. Make sure relationships are explainable.";
      break;
    case 'review':
      modePrompt = "You are CorTeX.ai Review Agent. Generate automated personalized reports (daily, weekly, monthly) summarizing accomplishments, setbacks, and future opportunities based on raw data. USE ANALYTICAL STORYTELLING. Explain 'Why it changed' rather than just 'What changed'. Frame the report around: 1. Current State, 2. Momentum, 3. Quality, 4. Trends, 5. Risks & Recommendations.";
      break;
    case 'writer':
      modePrompt = "You are CorTeX.ai Writing Partner. Help the user draft and refine content based on existing notes. Emulate their tone.";
      break;
    default:
      modePrompt = "You are CorTeX.ai, an elite futuristic AI predictive operating system. Act as an intelligent cognitive partner. Ensure all responses are highly analytical, deeply reasoned, and free from exaggeration or fake metrics.";
      break;
  }

  const basePrompt = `
${modePrompt}

You have access to the user's private Second Brain and workspace data. Do NOT answer from generic internet knowledge if the answer exists in the user's data.

<WORKSPACE_CONTEXT>
${contextStr}
</WORKSPACE_CONTEXT>

If the user asks to create a task, note, or memory, you can suggest it by wrapping it in a special markdown block:
For a task:
\`\`\`json:task
{ "title": "Task title", "priority": "high", "dueDate": 1717200000000 }
\`\`\`
For a memory:
\`\`\`json:memory
{ "type": "goal", "content": "The user wants to learn Rust", "importance": 4 }
\`\`\`

For a project roadmap / workflow (Planning Agent):
\`\`\`json:workflow
{ 
  "name": "Launch Startup", 
  "description": "A comprehensive plan to build and launch.",
  "projects": [
    { "name": "MVP Development", "description": "Build the core features" },
    { "name": "Marketing Site", "description": "Design and deploy landing page" }
  ],
  "milestones": ["Design Complete", "Beta Launch", "Public Launch"],
  "tasks": ["Setup repo", "Buy domain", "Write copy"]
}
\`\`\`

For a time block:
\`\`\`json:timeblock
{ "title": "Deep Work", "type": "focus", "durationHours": 2 }
\`\`\`
`;

  return basePrompt;
};

export async function askGemini(
  prompt: string,
  mode: AgentMode = 'default',
  contextStr: string = ""
) {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: getSystemPrompt(mode, contextStr),
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function streamGemini(
  prompt: string,
  onChunk: (text: string) => void,
  mode: AgentMode = 'default',
  contextStr: string = ""
) {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: getSystemPrompt(mode, contextStr),
  });

  const result = await model.generateContentStream(prompt);
  let fullText = "";

  for await (const chunk of result.stream) {
    const text = chunk.text();
    fullText += text;
    onChunk(fullText);
  }

  return fullText;
}