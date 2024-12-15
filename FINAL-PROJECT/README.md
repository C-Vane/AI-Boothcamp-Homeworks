# AI-Powered Sales Call Assistant

## Project Overview

An AI-powered voice call assistant that simulates sales calls using 11LABS for voice synthesis, LlamaIndex for document understanding, and OpenAI for conversation intelligence. The system includes an admin panel for managing targets and playbooks, and a mobile interface for simulated calls.

## Core Features

### Admin Panel

- Upload and manage target information
- Create and manage sales playbooks with document embedding
- View call transcripts and summaries
- Track TODO items generated from calls
- Company information management

### Target Interface

- Mobile-first call simulation
- Animated phone ring interface
- Active call timer display
- Call end indication
- Voice interaction

### Backend Systems

- Voice-to-Text conversion (11LABS)
- Text-to-Voice synthesis (11LABS)
- Document embedding and retrieval (LlamaIndex)
- Conversation Intelligence (OpenAI)
- Call transcript storage
- Automated call summary generation
- TODO list generation for admin

## Implementation Plan (1-Week Timeline)

### Foundation & Document Processing

#### Project Setup

- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up MongoDB with Mongoose
- [ ] Configure 11LABS API integration

#### Admin Panel & Document Management

- [ ] Create admin dashboard layout
- [ ] Create playbook management interface
  - [ ] Implement document upload system for playbooks to eleven labs
- [ ] Implement company information storage
- [ ] Create target management interface
- [ ] Create Sales agent creation interface
- [ ] Create conversation history interface

### Voice Call Simulation

#### Call Interface

- [ ] Build mobile call interface
- [ ] Implement ring animation
- [ ] Create call timer component
- [ ] Add call end animation

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
  adminId: ObjectId
}

//Agent Schema
{
  agentId: String,
  projectId: String,
}

//Admin Schema
{
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
}
```

#### Conversation History

- [ ] Implement Admin access to conversation history
- [ ] Implement call transcript summery

### Polish & Deployment

#### Testing & Optimization

- [ ] Add error handling
- [ ] Implement fallback scenarios

#### Deploy & Document

- [ ] Deploy to Vercel
- [ ] Set up MongoDB Atlas

## Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── voice/
│   │   ├── call/
│   │   └── admin/
│   ├── admin/
│   │   ├── targets/
│   │   ├── playbooks/
│   │   └── calls/
│   └── call/
├── components/
│   ├── admin/
│   ├── call/
│   └── ui/
├── lib/
│   ├── elevenlabs/
│   ├── openai/
│   ├── llamaindex/
│   └── db/
├── models/
└── public/
    └── assets/
```

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

## Key Features

- Document embedding and retrieval
- Real-time voice processing
- Intelligent conversation handling
- Call transcript storage
- Admin dashboard
- Mobile call interface

Next Steps:

- Automated call summaries
- TODO list generation
- Authentication and authorization
- Call scheduling and worker

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
ELEVENLABS_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=your_openai_key
```

4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

## User Flow

1. Admin uploads playbook and company information
2. System processes documents
3. Admin adds target details
4. Target receives simulated call
5. Voice conversation is processed through:
   - Voice-to-Text (11LABS)
   - Response generation (OpenAI)
   - Text-to-Voice (11LABS)
6. Admin can view transcripts and follow-up items
7. System generates call summary and TODOs

## Deployment

The application will be deployed on Vercel with MongoDB Atlas for database storage.
