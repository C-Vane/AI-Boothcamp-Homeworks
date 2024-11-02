"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, append, isLoading } = useChat();

  const [state, setState] = useState({
    topic: "",
    tone: "",
    type: "",
    temperature: 0.5,
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const topics = [
    { emoji: "👔", value: "Work" },
    { emoji: "👨‍👩‍👧‍👦", value: "People" },
    { emoji: "🐶", value: "Animals" },
    { emoji: "🍔", value: "Food" },
    { emoji: "📺", value: "Television" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];
  const types = [
    { emoji: "🤣", value: "Pun" },
    { emoji: "🚪", value: "Knock-Knock" },
    { emoji: "📖", value: "Story" },
  ];

  return (
    <main className='mx-auto w-full p-24 flex flex-col'>
      <div className='p4 m-4'>
        <div className='flex flex-col items-center justify-center space-y-8 text-white'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold'>Joke Telling App</h2>
            <p className='text-zinc-500 dark:text-zinc-400'>
              Customize the joke by selecting the topic, tone or type of joke.
            </p>
          </div>

          <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4'>
            <h3 className='text-xl font-semibold'>Topics</h3>

            <div className='flex flex-wrap justify-center'>
              {topics.map(({ value, emoji }) => (
                <div
                  key={value}
                  className='p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg'>
                  <input
                    id={value}
                    type='radio'
                    value={value}
                    name='topic'
                    onChange={handleChange}
                  />
                  <label className='ml-2' htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4'>
          <h3 className='text-xl font-semibold'>Tones</h3>

          <div className='flex flex-wrap justify-center'>
            {tones.map(({ value, emoji }) => (
              <div
                key={value}
                className='p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg'>
                <input
                  id={value}
                  type='radio'
                  value={value}
                  name='tone'
                  onChange={handleChange}
                />
                <label className='ml-2' htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4'>
          <h3 className='text-xl font-semibold'>Types</h3>

          <div className='flex flex-wrap justify-center'>
            {types.map(({ value, emoji }) => (
              <div
                key={value}
                className='p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg'>
                <input
                  id={value}
                  type='radio'
                  value={value}
                  name='type'
                  onChange={handleChange}
                />
                <label className='ml-2' htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
        disabled={isLoading || !state.topic || !state.tone || !state.type}
        onClick={() =>
          append({
            role: "user",
            content: `Generate a  ${!state.type} joke about ${
              state.topic
            } in a ${state.tone} tone`,
          })
        }>
        Generate Joke
      </button>

      <div
        hidden={
          messages.length === 0 ||
          messages[messages.length - 1]?.content.startsWith("Generate")
        }
        className='bg-opacity-25 bg-gray-700 rounded-lg p-4'>
        {messages[messages.length - 1]?.content}
      </div>

      {/*
            //TODO: 
              - Allow users to select:
                - A topic from a list of options (work, people, animals, food, television, etc.)
                - A tone for the joke (witty, sarcastic, silly, dark, goofy, etc.)
                - The type of joke (pun, knock-knock, story, etc.)
                - The "temperature" (how much randomness/creativity to add to the joke)

              - Button to tell the chat bot to evaluate: if the generated jokes are "funny", "appropriate", "offensive", 
                or other criteria you deem important
             */}
    </main>
  );
}
