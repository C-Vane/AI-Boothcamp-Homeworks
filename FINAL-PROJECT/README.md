# AI-Powered Sales Call Assistant

## Project Overview

An AI-powered voice call assistant that simulates sales calls using 11LABS for voice synthesis, LlamaIndex for document understanding, and OpenAI for conversation intelligence. The system includes an user panel for managing targets and playbooks, and a mobile interface for simulated calls.

## Core Features

### User Panel

- Upload and manage target information
- Create and manage sales playbooks with document embedding
- View call transcripts and summaries
- Track TODO items generated from calls
- Company information management

### Target Interface Simulation

- Mobile-first call simulation
- Animated phone ring interface
- Active call timer display
- Call end indication
- Voice interaction

### Backend Systems

- Voice-to-Text conversion (11LABS)
- Text-to-Voice synthesis (11LABS)
- Conversation Intelligence (OpenAI)

## Technical Stack

### Frontend

- Next.js 14
- TypeScript
- TailwindCSS
- Framer Motion (animations)

### Backend

- Next.js API Routes
- MongoDB with Mongoose
- 11LABS API

### Development Tools

- ESLint
- Prettier
- Jest
- React Testing Library

#### Next Steps:

- Automated call summaries
- TODO list generation
- Authentication and authorization
- Call scheduling and worker

## Project Structure

User has Projects
Projects have Agents
Projects have Targets
Agents are assigned to Targets
Agents have documents (Playbooks and Product Details, urls to a website)
Targets have calls

```
/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   └── [...nextauth]/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   │   └── [id]/
│   │   │       ├── agents/
│   │   │       └── targets/
│   │   ├── signed-url/
│   │   │   └── [agentId]/
│   │   └── voices/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/
│   ├── projects/
│   │   └── [id]/
│   └── simulation/
│       └── [agentId]/
│           └── [targetId]/
├── components/
│   ├── dashboard/
│   ├── project/
│   ├── ui/
│   └── ConvAI.tsx
├── lib/
│   ├── 11labs.ts
│   ├── db/
│   └── utils.ts
├── models/
│   ├── Agent.ts
│   ├── Project.ts
│   ├── Target.ts
│   └── User.ts
└── public/
    └── assets/
```

### Database

#### Database Structure

```typescript
// Target Schema
{
  name: String,
  company: String,
  position: String,
  phone: String,
  email: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'failed']
  },
  bestTimeToCall: String,
  timezone: String,
  lastContact: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date,
  contactInCommon: String,
  projectId: ObjectId
  agentId: ObjectId
}

// Call Schema
{
  targetId: ObjectId,
  startTime: Date,
  endTime: Date,
  duration: Number,
  transcript: [{
    timestamp: Date,
    speaker: String,
    text: String
  }],
  summary: String,
  todoItems: [{
    task: String,
    priority: String,
    status: String
  }],
  status: {
    type: String,
    enum: ['completed', 'failed', 'scheduled']
  }
}

// Project Schema
{
  name: String,
  description: String,
  logo: String,
  createdAt: Date,
  updatedAt: Date,
  userId: ObjectId
}

//Agent Schema
{
  agentId: String,
  projectId: String,
}

//User Schema
{
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
}
```

## Implementation Plan (1-Week Timeline)

### Foundation & Document Processing

#### Project Setup

- [x] Initialize Next.js project with TypeScript
- [x] Set up MongoDB with Mongoose
  - [x] Create Sign In and Sign Up pages and authentication system

#### User Panel & Document Management

- [x] Create user dashboard layout
  - [x] Create project management interface
- [x] Create playbook management interface
  - [x] Implement document upload system for playbooks to eleven labs
- [x] Implement company information storage
- [x] Create target management interface
- [x] Create Sales agent creation interface
- [x] Configure 11LABS API integration

  - [x] Implement the agent creation api call to 11labs (https://api.elevenlabs.io/v1/convai/agents)
  - [x] Implement the document upload api call to 11labs (https://api.elevenlabs.io/v1/convai/agents/{agent_id}/add-to-knowledge-base)

#### Conversation History

- [x] Implement Task and TODO list generation
  - [x] Save the conversations with an ID when a call ends
  - [x] Show calls when clicking on a target
  - [x] Show the call transcript, summery, and TODOs in call details

### Voice Call Simulation

#### Call Interface and Scheduling

- [x] Give agent more context update generic prompt with additional information
- [x] Improve user prompts with more context, and get additional product information from user
- [x] Get missing target information like their email address for calendar booking

### Google Calendar Integration

[x] Implement Google Calendar integration for admin
[x] Create a tool for the agent to get admin availabilities
[x] Create a tool for the agent to book a meeting

### Polish & Deployment

#### Testing & Optimization

- [x] Add error handling
- [x] Implement fallback scenarios

#### Deploy & Document

- [x] Deploy to Vercel
- [x] Set up MongoDB Atlas

## Getting Started

1. Install dependencies

```bash
npm install
# or
pnpm install
```

2. Set up environment variables

```env
MONGODB_URI=your_mongodb_uri
XI_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=your_openai_key
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI='http://localhost:3000/api/auth/callback/google' || prod_url + /api/auth/callback/google

```

4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

3. Seed Database

```bash
npm run seed
# or
pnpm seed
```

## User Flow

1. User uploads playbook and company information
2. System processes documents
3. User adds target details
4. Target receives simulated call
5. Voice conversation is processed through:
   - Voice-to-Text (11LABS)
   - Response generation (OpenAI)
   - Text-to-Voice (11LABS)
6. User can view transcripts and follow-up items
7. System generates call summary and TODOs

## Deployment

The application will be deployed on Vercel with MongoDB Atlas for database storage.

## License

The license of this project can be found under LICENSE in the final project directory.
