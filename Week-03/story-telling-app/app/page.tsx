"use client";

import { useState } from "react";
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
    { emoji: "🗡️", name: "Arthur", description: "A brave knight", personality: "Courageous" },
    { emoji: "🔮", name: "Luna", description: "A wise wizard", personality: "Intelligent" },
    { emoji: "🗝️", name: "Milo", description: "A cunning thief", personality: "Sneaky" },
    { emoji: "🌿", name: "Elara", description: "A kind healer", personality: "Compassionate" },
  ];

  const [state, setState] = useState({
    genre: "",
    tone: "",
    character: "",
  });

  const [customCharacter, setCustomCharacter] = useState({
    emoji: "",
    name: "",
    description: "",
    personality: "",
  });

  const [characters, setCharacters] = useState(predefinedCharacters);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
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

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the story by selecting the genre, tone, and character.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Genre</h3>
            <div className="flex flex-wrap justify-center">
              {genres.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
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

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>
            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
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
              {characters.map(({ emoji, name, description, personality }) => (
                <div
                  key={name}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={name}
                    type="radio"
                    name="character"
                    value={name}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={name}>
                    {`${emoji} ${name} - ${description} (${personality})`}
                  </label>
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
            disabled={isLoading || !state.genre || !state.tone || !state.character}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a ${state.genre} story in a ${state.tone} tone featuring ${state.character}`,
              })
            }
          >
            Generate Story
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>
        </div>
      </div>
    </main>
  );
}