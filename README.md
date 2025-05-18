# JiraGenius - AI-Enhanced Project Management Platform

JiraGenius is an enhanced version of Jira with powerful AI-driven features built specifically for modern development teams. Our platform streamlines the project management process by introducing smart automation and intelligent workflow assistance.

## 🚀 Live Demo

[View the live demo](https://jira-6xtd.vercel.app/)

## 🧠 Project Genesis & Innovation

We all love Jira for its project management capabilities, but we identified key pain points that still exist in the workflow:

- Sprint planning remains a time-consuming, manual process
- Translating feature ideas into technical implementation plans is often challenging
- There's a disconnect between high-level project vision and granular tasks

JiraGenius addresses these challenges with two game-changing AI-powered features:

### 1. AI-Powered Sprint Planning
Our intelligent sprint generation system allows teams to:
- Input project ideas and get a fully structured project outline with core and suggested features
- Receive optimized tech stack recommendations tailored to your project needs
- Generate complete, detailed sprint plans with task breakdowns, time estimates, and dependencies
- Get both developer-friendly and AI-assistant-friendly sprint plans that work together

### 2. Feature Implementation Planning
Seamlessly translate feature ideas into implementation plans:
- Input a feature concept and get a refined, structured feature description
- Generate comprehensive implementation plans with component breakdowns, technical considerations, and best practices
- Receive separate plans optimized for human developers and AI assistants enabling true human-AI collaboration

## 🌟 Key Features

- **Modern Jira Interface**: Familiar Jira-style UI with enhanced functionality
- **AI Sprint Generation**: Create comprehensive sprint plans with one click
- **Tech Stack Advisor**: Get personalized tech stack recommendations for your project
- **Feature Implementation Planner**: Translate ideas into actionable technical plans
- **Kanban Board**: Visualize and manage work with an intuitive drag-and-drop interface
- **Seamless AI-Human Collaboration**: Generate plans optimized for both developers and AI assistants

## 🛠️ Technical Innovation

JiraGenius leverages cutting-edge technologies:

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS for a modern, responsive interface
- **UI Components**: Radix UI primitives for accessibility and consistent design
- **Database**: Firebase Firestore for real-time data synchronization
- **AI Integration**: Google Generative AI (Gemini) for intelligent sprint and feature planning
- **PDF Export**: JSPdf for exporting implementation plans

## 💻 Getting Started

### Prerequisites
- Node.js (v20+)
- npm or yarn
- Firebase account
- Google Generative AI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SudarshanDhage/jira.git
   cd jira
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env.local` file with your Firebase and Gemini AI credentials
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## 📊 Project Structure

```
├── app/                      # Next.js App Router
│   ├── features/             # Feature planning pages
│   ├── projects/             # Project sprint planning pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── board/                # Kanban board components
│   ├── features/             # Feature planning components
│   ├── layouts/              # Layout components
│   ├── projects/             # Project management components
│   ├── ui/                   # Reusable UI components
│   ├── JiraBoard.tsx         # Main board component
│   ├── JiraHeader.tsx        # Application header
│   └── JiraSidebar.tsx       # Application sidebar
├── contexts/                 # React contexts
├── lib/                      # Utilities and services
│   ├── ai/                   # AI integration with Gemini
│   ├── firebase              # Firebase configuration and services
│   └── utils                 # Helper utilities
└── public/                   # Static assets
```

## 🔍 Use Cases

### For Development Teams
- **Project Kickoff**: Generate structured sprint plans from high-level project ideas
- **Feature Planning**: Translate feature requirements into detailed implementation guides
- **Sprint Planning**: Automate the creation of sprint tasks with smart estimates
- **Knowledge Transfer**: Create comprehensive documentation for onboarding new team members

### For Product Managers
- **Project Scoping**: Convert product ideas into structured feature breakdowns
- **Resource Planning**: Get intelligent estimates for development tasks
- **Technical Translation**: Bridge the gap between business requirements and technical implementation

### For Hackathon Participants
- **Quick Project Setup**: Generate complete project structures in minutes
- **Technology Selection**: Get intelligent tech stack recommendations
- **Implementation Guidance**: Receive detailed implementation plans for efficient coding

## 📋 Example Workflow

1. **Input Project Idea**: Enter a description of your project
2. **Review & Customize Project Structure**: Adjust core and suggested features
3. **Choose Tech Stack**: Select from AI-recommended technology options
4. **Generate Sprint Plan**: Get a complete, detailed sprint plan with tasks and estimates
5. **Add Feature Details**: Input specific feature requirements for detailed implementation plans
6. **Execute**: Track progress with the Kanban board

## 📝 Future Enhancements

- **AI-Powered Code Generation**: Generate starter code for features
- **Automatic Documentation**: Create technical documentation from implementation plans
- **Meeting Summarization**: Capture and organize key decisions from planning meetings
- **Integration with Version Control**: Link implementation plans with code commits


---

Built with ❤️ for the Coding Hackathon
