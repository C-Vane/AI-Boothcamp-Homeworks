"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const genres = [
    { emoji: "🧙", value: "Fantasy" },
    { emoji: "🕵️", value: "Mystery" },
    { emoji: "💑", value: "Romance" },
    { emoji: "🚀", value: "Sci-Fi" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];
  const predefinedCharacters = [
    { name: "Arthur", description: "A brave knight", personality: "Courageous" },
    { name: "Luna", description: "A wise wizard", personality: "Intelligent" },
    { name: "Milo", description: "A cunning thief", personality: "Sneaky" },
    { name: "Elara", description: "A kind healer", personality: "Compassionate" },
  ];

  const [state, setState] = useState({
    genre: "",
    tone: "",
    characters: [] as string[],
  });

  const [customCharacter, setCustomCharacter] = useState({
    emoji: "",
    name: "",
    description: "",
    personality: "",
  });

  const [characters, setCharacters] = useState(predefinedCharacters);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);

  const [storyGenerated, setStoryGenerated] = useState(false);

  const [storyContent, setStoryContent] = useState("");
  const [characterSummaryContent, setCharacterSummaryContent] = useState("");
  const [lastRequestType, setLastRequestType] = useState<"story" | "characterSummary" | null>(null);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleCharacterChange = (name: string) => {
    setState((prevState) => {
      const isSelected = prevState.characters.includes(name);
      const updatedCharacters = isSelected
        ? prevState.characters.filter((character) => character !== name)
        : [...prevState.characters, name];
      return { ...prevState, characters: updatedCharacters };
    });
  };

  const handleCustomCharacterChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCharacter({
      ...customCharacter,
      [name]: value,
    });
  };

  const addCustomCharacter = () => {
    if (customCharacter.name && customCharacter.description && customCharacter.personality && customCharacter.emoji) {
      setCharacters([...characters, customCharacter]);
      setCustomCharacter({ emoji: "", name: "", description: "", personality: "" });
      setShowCreateCharacter(false);
    }
  };

  const deleteCharacter = (name: string) => {
    setCharacters(characters.filter(character => character.name !== name));
  };

  const handleGenerateStory = () => {
    setStoryGenerated(false);
    setLastRequestType("story");
    append({
      role: "user",
      content: `Generate a ${state.genre} story in a ${state.tone} tone starring ${state.characters.join(", ")}. Keep story under 100 words.`,
    });
  };

  const handleGenerateCharacterSummary = () => {
    setLastRequestType("characterSummary");
    append({
      role: "user",
      content: `Provide the name of each character in the story, followed by their role in the story`,
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]?.content;
      if (lastRequestType === "story") {
        setStoryContent(lastMessage);
      } else if (lastRequestType === "characterSummary") {
        setCharacterSummaryContent(lastMessage);
      }
    }
  }, [messages, lastRequestType]);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-20">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold">Story Telling App</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Customize the story by selecting the genre, tone, and characters.
          </p>
        </div>
      </header>
      <div className="flex">
        <aside className="fixed top-20 left-0 bg-gray-700 text-white p-4 shadow-md z-10 h-full w-64">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Genre</h3>
              <div className="flex flex-col">
                {genres.map(({ value, emoji }) => (
                  <div
                    key={value}
                    className="p-2 m-1 bg-opacity-25 bg-gray-600 rounded-lg flex items-center"
                  >
                    <input
                      id={value}
                      type="radio"
                      value={value}
                      name="genre"
                      onChange={handleChange}
                    />
                    <label className="ml-2" htmlFor={value}>
                      {`${emoji} ${value}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Tones</h3>
              <div className="flex flex-col">
                {tones.map(({ value, emoji }) => (
                  <div
                    key={value}
                    className="p-2 m-1 bg-opacity-25 bg-gray-600 rounded-lg flex items-center"
                  >
                    <input
                      id={value}
                      type="radio"
                      name="tone"
                      value={value}
                      onChange={handleChange}
                    />
                    <label className="ml-2" htmlFor={value}>
                      {`${emoji} ${value}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <main className="ml-64 mt-24 p-8 flex-1">
          <div className="p4 m-4">
            <div className="flex flex-col items-center justify-center space-y-8 text-white">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full text-center">
                <p className="text-lg">
                  <strong>Selected Options:</strong> 
                  {state.genre ? ` Genre: ${state.genre}` : ''} 
                  {state.tone ? ` | Tone: ${state.tone}` : ''} 
                  {state.characters.length > 0 ? ` | Characters: ${state.characters.join(', ')}` : ''}
                </p>
              </div>
              <div className="flex w-full space-x-4">
                <div className="flex-1 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold">Story</h3>
                  <div>{storyContent}</div>
                </div>
                <div className="flex-1 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold">Character Summary</h3>
                  <div>
                    {characterSummaryContent.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Characters</h3>
                  <button
                    onClick={() => setShowCreateCharacter(!showCreateCharacter)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Create Character
                  </button>
                </div>
                <div className="flex flex-wrap justify-center">
                  {characters.map(({ name, description, personality }) => (
                    <div
                      key={name}
                      className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg flex items-center"
                    >
                      <input
                        id={name}
                        type="checkbox"
                        name="character"
                        value={name}
                        checked={state.characters.includes(name)}
                        onChange={() => handleCharacterChange(name)}
                      />
                      <label className="ml-2" htmlFor={name}>
                        {`${name} - ${description} (${personality})`}
                      </label>
                      <button
                        onClick={() => deleteCharacter(name)}
                        className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                {showCreateCharacter && (
                  <div className="space-y-4 mt-4">
                    <input
                      type="text"
                      name="emoji"
                      placeholder="Emoji"
                      value={customCharacter.emoji}
                      onChange={handleCustomCharacterChange}
                      className="p-2 m-2 bg-gray-600 rounded-lg"
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={customCharacter.name}
                      onChange={handleCustomCharacterChange}
                      className="p-2 m-2 bg-gray-600 rounded-lg"
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={customCharacter.description}
                      onChange={handleCustomCharacterChange}
                      className="p-2 m-2 bg-gray-600 rounded-lg"
                    />
                    <input
                      type="text"
                      name="personality"
                      placeholder="Personality"
                      value={customCharacter.personality}
                      onChange={handleCustomCharacterChange}
                      className="p-2 m-2 bg-gray-600 rounded-lg"
                    />
                    <button
                      onClick={addCustomCharacter}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Character
                    </button>
                  </div>
                )}
              </div>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading || !state.genre || !state.tone || state.characters.length === 0}
                onClick={handleGenerateStory}
              >
                Generate Story
              </button>
              {storyGenerated && (
                <div className="animation-container">
                  <div className="animation">Story Generated!</div>
                </div>
              )}
              <style jsx>{`
                .animation-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-top: 20px;
                }
                .animation {
                  animation: fadeIn 2s ease-in-out;
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
              `}</style>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={
                  isLoading ||
                  !state.genre ||
                  !state.tone ||
                  state.characters.length === 0 ||
                  messages.length === 0 ||
                  !messages[messages.length - 1]?.content ||
                  messages[messages.length - 1]?.content.includes("Generate a")
                }
                onClick={handleGenerateCharacterSummary}
              >
                Generate Character Summary
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}