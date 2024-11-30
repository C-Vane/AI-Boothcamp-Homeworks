"use client";

import { useChat } from "ai/react";
import React, { useEffect, useState } from "react";

export default function Chat() {
  const { messages: classifyMessages, append: appendClassify } = useChat({
    id: "classify",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [animalDangerState, setAnimalDangerState] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleGenerateCharacterSummary = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // First, send the image to your Python backend for classification
      const classificationResponse = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });
      const { animal } = await classificationResponse.json();

      // Then, use the animal name to check if it's dangerous
      await appendClassify({
        role: "user",
        content: `Is a ${animal} dangerous? Please provide a brief explanation.`,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lastMessage = classifyMessages[classifyMessages.length - 1]?.content;
    setAnimalDangerState(lastMessage);
  }, [classifyMessages]);

  return (
    <>
      <header className='absolute left-0 right-0 top-0 z-20 bg-gray-800 p-4 text-white shadow-md'>
        <div className='flex flex-col items-center'>
          <h2 className='text-3xl font-bold'>Is This Animal Dangerous?</h2>
          <p className='text-zinc-500 dark:text-zinc-400'>
            Upload an image of an animal to check if it`s dangerous
          </p>
        </div>
      </header>
      <div className='flex'>
        <main className='ml-64 mt-24 flex-1 p-8'>
          <div className='p4 m-4'>
            <div className='flex flex-col items-center justify-center space-y-8 text-white'>
              <div className='w-full max-w-xl'>
                <div className='flex flex-col items-center space-y-4'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100'
                  />
                  {previewUrl && (
                    <div className='mt-4'>
                      <img
                        src={previewUrl}
                        alt='Preview'
                        className='max-w-md rounded-lg shadow-lg'
                      />
                    </div>
                  )}
                  <button
                    onClick={handleGenerateCharacterSummary}
                    disabled={isLoading || !selectedImage}
                    className='mt-4 rounded-full bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 disabled:opacity-50'>
                    {isLoading ? "Processing..." : "Analyze Animal"}
                  </button>
                  {animalDangerState && (
                    <div className='mt-6 rounded-lg bg-gray-700 p-4'>
                      <h3 className='mb-2 text-xl font-semibold'>
                        Analysis Result:
                      </h3>
                      <p>{animalDangerState}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
