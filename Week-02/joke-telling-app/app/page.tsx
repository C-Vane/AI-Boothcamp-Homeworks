"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const [state, setState] = useState({
    topic: "",
    tone: "",
    type: "",
    temperature: 1,
  });

  const { messages, append, setMessages, isLoading } = useChat({});

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
    { emoji: "😡", value: "Offensive" },
  ];
  const types = [
    { emoji: "🤣", value: "Pun" },
    { emoji: "🚪", value: "Knock-Knock" },
    { emoji: "📖", value: "Story" },
  ];

  return (
    <main className='mx-auto w-full p-24 flex flex-col'>
      <div className='p4 m-4'>
        <div className='flex flex-col items-center justify-center space-y-8 text-white gap-2'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold text-center'>Joke Telling App</h2>
            <p className='text-zinc-500 dark:text-zinc-400'>
              Customize the joke by selecting the topic, tone or type of joke.
            </p>
          </div>

          <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4  w-4/5 m-auto'>
            <h3 className='text-xl font-semibold'>Topics</h3>

            <div className='flex flex-wrap justify-center '>
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

          <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 w-4/5 m-auto'>
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

          <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 w-4/5 m-auto'>
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

          <div className='space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 w-4/5 m-auto'>
            <h3 className='text-xl font-semibold'>Types</h3>

            <div className='flex flex-wrap justify-center'>
              <div className='p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg'>
                <input
                  id='temperature'
                  type='range'
                  value={state.temperature}
                  name='temperature'
                  onChange={handleChange}
                  min='0'
                  max='2'
                  step='0.1'
                />
                <label className='ml-2' htmlFor='temperature'>
                  {`🔥 Temperature`}
                </label>
              </div>
            </div>
          </div>

          <button
            className='bg-black-500 hover:bg-gray-700 border border-white text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-auto mt-5'
            disabled={isLoading || !state.topic || !state.tone || !state.type}
            onClick={() => {
              setMessages([]);
              append(
                {
                  role: "user",
                  content: `         
                  As comedian Tyrone Biggums, deliver a ${state.type} joke on the topic of ${state.topic} in a ${state.tone} tone, feel free to be creative.
                    `,
                },
                {
                  body: { temperature: Number(state.temperature) },
                }
              );
            }}>
            Generate Joke
          </button>
        </div>
      </div>

      <div
        hidden={messages.length < 2}
        className='bg-opacity-25 bg-gray-700 rounded-lg p-4'>
        {messages[1]?.content}
      </div>

      {messages[3] && (
        <div hidden={messages.length < 4} className='flex gap-3 flex-wrap mt-6'>
          {messages[3]?.content.split(",").map((adjective) => (
            <span className='px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full first-letter:uppercase'>
              {adjective}
            </span>
          ))}
        </div>
      )}

      <button
        hidden={messages.length < 1}
        className='bg-black-500 hover:bg-gray-700 border border-white text-white font-bold py-2 px-4 rounded disabled:opacity-50 m-auto mt-5'
        disabled={isLoading || !state.topic || !state.tone || !state.type}
        onClick={() => {
          append(
            {
              role: "user",
              content: `Evaluate this joke and tell me if it's funny, appropriate, offensive etc..., List only the 5 most relevant key adjectives, comma separated: ${
                messages[messages.length - 1]?.content
              }`,
            },
            {
              body: { temperature: 1 },
            }
          );
        }}>
        Evaluate Joke
      </button>
    </main>
  );
}
