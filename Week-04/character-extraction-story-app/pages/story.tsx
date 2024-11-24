"use client";

import { useChat } from "ai/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import charactersData from "../lib/characters.json";

export default function Chat() {
  const { messages: storyMessages, append: appendStory } = useChat({
    id: "story",
  });
  const { messages: summaryMessages, append: appendSummary } = useChat({
    id: "summary",
  });
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
    ...charactersData.extractedCharacters,
    ...charactersData.predefinedCharacters,
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
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const [storyContent, setStoryContent] = useState("");
  const [characterSummaryContent, setCharacterSummaryContent] = useState("");
  const [lastRequestType, setLastRequestType] = useState<
    "story" | "characterSummary" | null
  >(null);

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

  const addCustomCharacter = async () => {
    if (
      customCharacter.name &&
      customCharacter.description &&
      customCharacter.personality &&
      customCharacter.emoji
    ) {
      try {
        const response = await fetch("/api/characters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customCharacter),
        });

        if (!response.ok) {
          throw new Error("Failed to add character");
        }

        setCharacters([...characters, customCharacter]);
        setCustomCharacter({
          emoji: "",
          name: "",
          description: "",
          personality: "",
        });
        setShowCreateCharacter(false);
      } catch (error) {
        console.error("Error adding character:", error);
        alert("Failed to add character. Please try again.");
      }
    }
  };

  const deleteCharacter = async (name: string) => {
    try {
      const response = await fetch(
        `/api/characters?name=${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete character");
      }

      setCharacters(characters.filter((character) => character.name !== name));
    } catch (error) {
      console.error("Error deleting character:", error);
      alert("Failed to delete character. Please try again.");
    }
  };

  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    setStoryContent("Generating story...");
    await appendStory({
      role: "user",
      content: `Generate a ${state.genre} story in a ${
        state.tone
      } tone starring ${state.characters.join(
        ", ",
      )}. Keep story under 100 words.`,
    });
    setLastRequestType("story");
    setIsGeneratingStory(false);
  };

  const handleGenerateCharacterSummary = async () => {
    setIsGeneratingSummary(true);
    setCharacterSummaryContent("Generating character summary...");
    await appendSummary({
      role: "user",
      content: `Based on this story: "${storyContent}", provide a well-formatted list of characters and their roles. Format it as follows:
# Characters in the Story

[For each character, include:]
- **[Character Name]**
  - Role: [Their role or function in the story]
  - Notable Actions: [Key actions or contributions to the plot]
  
Please ensure each character entry is properly formatted with markdown headings and bullet points.`,
    });
    setLastRequestType("characterSummary");
    setIsGeneratingSummary(false);
  };

  useEffect(() => {
    if (storyMessages.length > 0 && lastRequestType === "story") {
      const lastMessage = storyMessages[storyMessages.length - 1]?.content;
      setStoryContent(lastMessage);
    }
  }, [storyMessages, lastRequestType]);

  useEffect(() => {
    if (summaryMessages.length > 0 && lastRequestType === "characterSummary") {
      const lastMessage = summaryMessages[summaryMessages.length - 1]?.content;
      setCharacterSummaryContent(lastMessage);
    }
  }, [summaryMessages, lastRequestType]);

  const formatContent = (content: string) => {
    if (!content) return "";
    // Convert markdown to basic HTML styling
    return content
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) {
          return `<h3 class="text-xl font-bold mb-4">${line.substring(2)}</h3>`;
        } else if (line.startsWith("- **")) {
          return `<div class="font-semibold text-lg mt-4 text-blue-300">${line
            .substring(3)
            .replace("**", "")}</div>`;
        } else if (line.startsWith("  - ")) {
          return `<div class="ml-4 my-2 text-gray-300">${line.substring(
            4,
          )}</div>`;
        }
        return `<div class="my-2">${line}</div>`;
      })
      .join("");
  };

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-20 bg-gray-800 p-4 text-white shadow-md">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold">Story Telling App</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Customize the story by selecting the genre, tone, and characters.
          </p>
        </div>
      </header>
      <div className="flex">
        <aside className="fixed left-0 top-20 z-10 h-full w-64 bg-gray-700 p-4 text-white shadow-md">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Genre</h3>
              <div className="flex flex-col">
                {genres.map(({ value, emoji }) => (
                  <div
                    key={value}
                    className="m-1 flex items-center rounded-lg bg-gray-600 bg-opacity-25 p-2"
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
                    className="m-1 flex items-center rounded-lg bg-gray-600 bg-opacity-25 p-2"
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
        <main className="ml-64 mt-24 flex-1 p-8">
          <div className="p4 m-4">
            <div className="flex flex-col items-center justify-center space-y-8 text-white">
              <div className="w-full rounded-lg bg-gray-800 p-4 text-center shadow-md">
                <p className="text-lg">
                  <strong>Selected Options:</strong>
                  {state.genre ? ` Genre: ${state.genre}` : ""}
                  {state.tone ? ` | Tone: ${state.tone}` : ""}
                  {state.characters.length > 0
                    ? ` | Characters: ${state.characters.join(", ")}`
                    : ""}
                </p>
              </div>
              <div className="flex w-full space-x-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Story</h3>
                    <button
                      className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                      disabled={
                        isGeneratingStory ||
                        !state.genre ||
                        !state.tone ||
                        state.characters.length === 0
                      }
                      onClick={handleGenerateStory}
                    >
                      {isGeneratingStory ? "Generating..." : "Generate Story"}
                    </button>
                  </div>
                  <div className="min-h-[200px] rounded-lg bg-gray-700 bg-opacity-25 p-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          formatContent(storyContent) ||
                          "Your story will appear here...",
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Character Summary</h3>
                    <button
                      className="rounded bg-green-500 px-4 py-2 font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50"
                      disabled={isGeneratingSummary || !storyContent}
                      onClick={handleGenerateCharacterSummary}
                    >
                      {isGeneratingSummary
                        ? "Generating..."
                        : "Generate Summary"}
                    </button>
                  </div>
                  <div className="min-h-[200px] rounded-lg bg-gray-700 bg-opacity-25 p-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          formatContent(characterSummaryContent) ||
                          "Character summary will appear here...",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4 rounded-lg bg-gray-700 bg-opacity-25 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Characters</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        setShowCreateCharacter(!showCreateCharacter)
                      }
                      className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700"
                    >
                      Create Character
                    </button>
                    <Link
                      href="/"
                      className="rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700"
                    >
                      Extract Characters from Story
                    </Link>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {characters.map(({ name, description, personality }) => (
                    <div
                      key={name}
                      className="flex items-start space-x-4 rounded-lg bg-gray-800 p-4 transition-colors duration-200 hover:bg-gray-700"
                    >
                      <div className="flex h-5 items-center">
                        <input
                          id={name}
                          type="checkbox"
                          name="character"
                          value={name}
                          checked={state.characters.includes(name)}
                          onChange={() => handleCharacterChange(name)}
                          className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={name}
                          className="flex cursor-pointer flex-col space-y-1"
                        >
                          <span className="text-lg font-semibold">{name}</span>
                          <span className="text-sm text-gray-400">
                            {description}
                          </span>
                          <span className="text-xs italic text-gray-500">
                            Personality: {personality}
                          </span>
                        </label>
                      </div>
                      <button
                        onClick={() => deleteCharacter(name)}
                        className="ml-2 rounded-full p-2 transition-colors duration-200 hover:bg-red-600 hover:text-white"
                        title="Delete character"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {showCreateCharacter && (
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      name="emoji"
                      placeholder="Emoji"
                      value={customCharacter.emoji}
                      onChange={handleCustomCharacterChange}
                      className="m-2 rounded-lg bg-gray-600 p-2"
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={customCharacter.name}
                      onChange={handleCustomCharacterChange}
                      className="m-2 rounded-lg bg-gray-600 p-2"
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={customCharacter.description}
                      onChange={handleCustomCharacterChange}
                      className="m-2 rounded-lg bg-gray-600 p-2"
                    />
                    <input
                      type="text"
                      name="personality"
                      placeholder="Personality"
                      value={customCharacter.personality}
                      onChange={handleCustomCharacterChange}
                      className="m-2 rounded-lg bg-gray-600 p-2"
                    />
                    <button
                      onClick={addCustomCharacter}
                      className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                    >
                      Add Character
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
