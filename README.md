<div align="center">
  <img src="public/favicon.ico" alt="corTeX.ai Logo" width="80" height="80" />
  <h1 align="center">corTeX.ai</h1>
  <p align="center">
    <strong>The Deep Work OS & Intelligence Core</strong>
  </p>
  <p align="center">
    A next-generation productivity environment blending focused work, intelligent analytics, and an autonomous AI workspace.
  </p>

  <div>
    <img src="https://img.shields.io/badge/React-19.2-blue.svg?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-7.3-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.2-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Gemini_AI-Enabled-EA4335.svg?style=for-the-badge&logo=google" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E.svg?style=for-the-badge&logo=supabase" alt="Supabase" />
  </div>
</div>

---

## ⚡ Overview

**corTeX.ai** is not just another to-do list app. It is a comprehensive "Deep Work Operating System" designed for high-performers, researchers, and creators. By integrating task management, focus sessions (Pomodoro), a visually stunning analytics command center, and a highly capable AI assistant powered by Google Gemini, corTeX.ai acts as your second brain.

## ✨ Core Features

### 🧠 AI Workspace (Intelligence Core)
- **Universal Multi-Model Fallback**: Instantly connects to the best available Google Gemini model (`gemini-1.5-flash`, `gemini-pro`, etc.) based on your API key.
- **Context-Aware Assistance**: The AI has access to your workspace context to help you synthesize information, brainstorm, and solve complex problems.

### 📊 Analytics Command Center
- **GitHub-Style Consistency Heatmap**: A beautifully crafted, interactive heatmap tracking your Focus Sessions, Deep Work Minutes, and Knowledge Notes.
- **Velocity Trends & Momentum**: Advanced data visualizations (built with Recharts) tracking your productivity momentum with glowing, glassmorphic UI elements.
- **Focus Distribution**: Analyze your peak productivity windows with intelligent donut charts and bar graphs.

### ⏳ Deep Work & Planner
- **Focus Sessions**: Built-in timers to track deep work intervals, ensuring you maintain a flow state.
- **Task Management**: Organize, prioritize, and execute your daily objectives seamlessly.

### 📓 Second Brain & Knowledge Graph
- **Knowledge Nodes**: Capture and interlink your thoughts.
- **Interactive Graph**: Visualize the connections between your notes using `react-force-graph`.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (for fluid animations), Radix UI (accessible components)
- **State Management**: Zustand, TanStack Query
- **Routing**: TanStack Router
- **Backend/Auth**: Supabase
- **AI Integration**: `@google/generative-ai` (Gemini API)
- **Data Visualization**: Recharts, React Force Graph

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- A Supabase Project (for database and authentication)
- A Google AI Studio API Key (for Gemini)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1divy2/cOrTeX-aI.git
   cd cOrTeX-aI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *Note: For Cloudflare Pages deployment, ensure `VITE_GEMINI_API_KEY` is set as a **Plain text** variable, not a Secret.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚢 Deployment (Cloudflare Pages)

corTeX.ai is optimized for deployment on Cloudflare Pages.

1. Connect your GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the build output directory to `dist`.
4. Add your environment variables in the Cloudflare dashboard.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/1divy2/cOrTeX-aI/issues).

## 📄 License

This project is licensed under the MIT License.
