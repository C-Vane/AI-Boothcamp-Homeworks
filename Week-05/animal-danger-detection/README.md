# Animal Danger Detection App

A dynamic Next.js application that combines character extraction from text with creative story generation. This app allows users to extract characters from existing stories and use them to generate new stories with different genres and tones.

🔗 [Try it live on Vercel]()

## Features

### Character Management

- **Extract Characters**: Upload text and automatically extract characters using AI
- **Create Custom Characters**: Add your own characters with emojis, descriptions, and personalities
- **Character Library**: Maintain a collection of both extracted and custom characters
- **Delete Characters**: Remove characters you no longer need

### Story Generation

- **Multiple Genres**: Choose from Fantasy, Mystery, Romance, and Sci-Fi
- **Story Tones**: Select different emotional tones (Happy, Sad, Sarcastic, Funny)
- **Character Selection**: Pick multiple characters for your story
- **Character Summary**: Generate detailed summaries of character roles and actions

## How to Use

1. **Character Management**:

   - Click "Extract Characters from Story" to analyze text and extract characters
   - Or use "Create Character" to add custom characters with:
     - Emoji representation
     - Character name
     - Description
     - Personality traits

2. **Generate Stories**:

   - Select a genre (Fantasy, Mystery, Romance, Sci-Fi)
   - Choose a tone (Happy, Sad, Sarcastic, Funny)
   - Select characters from your library
   - Click "Generate Story" to create a unique tale

3. **Character Analysis**:
   - After generating a story, click "Generate Summary"
   - View detailed character roles and actions from the generated story

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **AI Integration**: OpenAI API, LlamaIndex
- **State Management**: React Hooks
- **API**: Edge Runtime, Vercel AI SDK

## Local Development

1. Clone the repository:

```bash
git clone [your-repo-url]
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# Add your OpenAI API key to .env.local
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key

## Contributing

Feel free to submit issues and enhancement requests!

## License

[Add your license here]

---

Built with ❤️ using Next.js and OpenAI
