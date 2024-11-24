import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkedSlider } from "@/components/ui/linkedslider";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_CHUNK_SIZE = 3000;
const DEFAULT_CHUNK_OVERLAP = 20;
const DEFAULT_TOP_K = 2;
const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_TOP_P = 1;

export default function Home() {
  const answerId = useId();
  const sourceId = useId();
  const [text, setText] = useState("");
  const [needsNewIndex, setNeedsNewIndex] = useState(true);
  const [buildingIndex, setBuildingIndex] = useState(false);
  const [runningQuery, setRunningQuery] = useState(false);
  const [nodesWithEmbedding, setNodesWithEmbedding] = useState([]);
  const [answer, setAnswer] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE.toString());
  const [chunkOverlap, setChunkOverlap] = useState(
    DEFAULT_CHUNK_OVERLAP.toString(),
  );
  const [topK, setTopK] = useState(DEFAULT_TOP_K.toString());
  const [temperature, setTemperature] = useState(
    DEFAULT_TEMPERATURE.toString(),
  );
  const [topP, setTopP] = useState(DEFAULT_TOP_P.toString());

  return (
    <>
      <Head>
        <title>Character Extraction App</title>
      </Head>
      <header className="absolute left-0 right-0 top-0 z-20 bg-gray-800 p-4 text-white shadow-md">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">Character Extraction</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Upload a text file to extract characters and their details
          </p>
        </div>
      </header>
      <main className="mt-24 flex h-full flex-col p-8">
        <div className="space-y-8">
          <div className="rounded-lg bg-gray-700 bg-opacity-25 p-6">
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Settings
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <LinkedSlider
                    label="Chunk Size:"
                    description={
                      "The maximum size of the chunks we are searching over, in tokens. " +
                      "Larger chunks help maintain character context but may slow down processing. " +
                      "Recommended to keep at maximum (3000) for best character extraction results."
                    }
                    min={1}
                    max={3000}
                    step={1}
                    value={chunkSize}
                    onChange={(value: string) => {
                      setChunkSize(value);
                      setNeedsNewIndex(true);
                    }}
                  />
                </div>
                <div>
                  <LinkedSlider
                    label="Chunk Overlap:"
                    description={
                      "The maximum amount of overlap between chunks, in tokens. " +
                      "Overlap helps ensure that sufficient contextual information is retained."
                    }
                    min={1}
                    max={600}
                    step={1}
                    value={chunkOverlap}
                    onChange={(value: string) => {
                      setChunkOverlap(value);
                      setNeedsNewIndex(true);
                    }}
                  />
                </div>
                <div>
                  <LinkedSlider
                    label="Top K:"
                    description={
                      "The maximum number of chunks to return from the search. " +
                      "It's called Top K because we are retrieving the K nearest neighbors of the query."
                    }
                    min={1}
                    max={15}
                    step={1}
                    value={topK}
                    onChange={(value: string) => {
                      setTopK(value);
                    }}
                  />
                </div>
                <div>
                  <LinkedSlider
                    label="Temperature:"
                    description={
                      "Temperature controls the variability of model response. Adjust it " +
                      "downwards to get more consistent responses, and upwards to get more diversity."
                    }
                    min={0}
                    max={1}
                    step={0.01}
                    value={temperature}
                    onChange={(value: string) => {
                      setTemperature(value);
                    }}
                  />
                </div>
                <div>
                  <LinkedSlider
                    label="Top P:"
                    description={
                      "Top P is another way to control the variability of the model " +
                      "response. It filters out low probability options for the model. It's " +
                      "recommended by OpenAI to set temperature to 1 if you're adjusting " +
                      "the top P."
                    }
                    min={0}
                    max={1}
                    step={0.01}
                    value={topP}
                    onChange={(value: string) => {
                      setTopP(value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Upload Text</h2>
              <div className="rounded-lg bg-gray-800 p-6">
                <Label htmlFor={sourceId} className="text-lg text-white">
                  Upload source text file:
                </Label>
                <Input
                  id={sourceId}
                  type="file"
                  accept=".txt"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const fileContent = event.target?.result as string;
                        setText(fileContent);
                        setNeedsNewIndex(true);
                      };
                      if (file.type !== "text/plain") {
                        console.error(`${file.type} parsing not implemented`);
                        setText("Error: Only .txt files are supported");
                      } else {
                        reader.readAsText(file);
                      }
                    }
                  }}
                  className="mt-2 bg-gray-700"
                />
                {text && (
                  <Textarea
                    value={text}
                    readOnly
                    placeholder="File contents will appear here"
                    className="mt-4 h-48 bg-gray-700"
                  />
                )}
              </div>

              <div className="flex justify-between space-x-4">
                <Button
                  disabled={!needsNewIndex || buildingIndex || runningQuery}
                  onClick={async () => {
                    setAnswer("Building index...");
                    setBuildingIndex(true);
                    setNeedsNewIndex(false);

                    // Post the text to the server to be split and embedded
                    const result = await fetch("/api/splitandembed", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        document: text,
                        chunkSize: parseInt(chunkSize),
                        chunkOverlap: parseInt(chunkOverlap),
                      }),
                    });

                    const { error, payload } = await result.json();

                    if (error) {
                      setAnswer(error);
                      setBuildingIndex(false);
                      return;
                    }

                    if (payload) {
                      setNodesWithEmbedding(payload.nodesWithEmbedding);
                      setAnswer(
                        "Index built! You can now extract the characters.",
                      );
                      setBuildingIndex(false);
                    }
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-700"
                >
                  {buildingIndex ? "Building Index..." : "Build Index"}
                </Button>

                <Button
                  disabled={nodesWithEmbedding.length === 0 || runningQuery}
                  onClick={async () => {
                    setAnswer("Running query...");
                    setRunningQuery(true);
                    setSuccessMessage("");

                    const query =
                      "Extract all characters from the text and list them";

                    const result = await fetch("/api/retrieveandquery", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        query,
                        nodesWithEmbedding,
                        topK: parseInt(topK),
                        temperature: parseFloat(temperature),
                        topP: parseFloat(topP),
                      }),
                    });

                    const { error, payload } = await result.json();

                    if (error) {
                      setAnswer(error);
                      setRunningQuery(false);
                      return;
                    }

                    if (payload) {
                      setAnswer(payload.response);

                      // Parse the response to extract characters
                      try {
                        interface Character {
                          name: string;
                          description: string;
                          personality: string;
                        }

                        console.log("Raw response:", payload.response);
                        const characters = JSON.parse(payload.response);
                        console.log("Parsed characters:", characters);

                        if (!Array.isArray(characters)) {
                          throw new Error("Expected characters to be an array");
                        }

                        // Validate each character object
                        const validatedCharacters = characters
                          .map((char: any) => {
                            if (
                              !char.name ||
                              !char.description ||
                              !char.personality
                            ) {
                              console.log("Invalid character object:", char);
                              return null;
                            }
                            return {
                              name: char.name,
                              description: char.description,
                              personality: char.personality,
                            };
                          })
                          .filter((char): char is Character => char !== null);

                        // Save characters using the API endpoint
                        try {
                          const saveResult = await fetch(
                            "/api/saveCharacters",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                characters: validatedCharacters,
                              }),
                            },
                          );

                          if (saveResult.ok) {
                            setSuccessMessage(
                              `Successfully extracted ${validatedCharacters.length} characters! Go to Story Telling to use them.`,
                            );
                          } else {
                            setSuccessMessage(
                              "Failed to save characters. Please try again.",
                            );
                          }
                        } catch (e) {
                          console.error("Failed to save characters:", e);
                          setSuccessMessage(
                            "Failed to save characters. Please try again.",
                          );
                        }

                        setRunningQuery(false);
                      } catch (e) {
                        console.error("Failed to parse characters:", e);
                        setSuccessMessage(
                          "Failed to parse characters. Please try again.",
                        );
                        setRunningQuery(false);
                      }
                    }
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-700"
                >
                  {runningQuery ? "Extracting..." : "Extract Characters"}
                </Button>

                <Link href="/story" className="flex-1">
                  <button
                    className="w-full rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700 disabled:opacity-50"
                    disabled={!answer}
                  >
                    Generate Story
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="rounded-lg bg-green-500 bg-opacity-20 p-4 text-green-400">
              {successMessage}
            </div>
          )}

          <div className="rounded-lg bg-gray-700 bg-opacity-25 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Extracted Characters
            </h2>
            <Textarea
              id={answerId}
              value={answer}
              readOnly
              placeholder="Extracted characters will appear here"
              className="h-48 w-full bg-gray-800"
            />
          </div>
        </div>
      </main>
    </>
  );
}
