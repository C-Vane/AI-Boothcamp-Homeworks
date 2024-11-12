## Week 3 Task

To consolidate this week's knowledge, students should complete the following project:

1. Create a GitHub repository for your project
2. Add all group members as collaborators
3. Create a README.md file with your project description
4. Use the `story-telling-app` as a base repository or create a new application from scratch using NextJS
5. Implement a table of characters that users can create for the story
   - Users should be able to add, edit, and delete characters
   - Each new character should have a name, description, and personality
6. Customize the prompt to generate a story using user-created characters, if any
7. Implement a summary of each character's role in the story after the full text has been generated
8. Test different models for story generation and compare their outputs
   - Evaluate how well the models "remember" user-created characters
   - Experiment with different **context window** sizes across models to observe their impact on output
   - Test models of varying sizes and observe how this influences the output
     - Use models compatible with your device, focusing on the experiment rather than overall story quality
9. Submit your project via the submission form

> Locate your group in the [Discord](https://discord.gg/encodeclub) AI Bootcamp Channel
>
> > If you can't find your group, contact the program manager through Discord or email
## Customizations
- The Script: You are a professional storyteller who has been hired to write a series of short stories for a new anthology. 
        The stories should be captivating, imaginative, and thought-provoking. 
        They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. 
        Each story should be unique and memorable, with compelling characters and unexpected plot twists.

## Tests

### Test 1: Model: tinyllama-1.1b-chat-v1.0.Q5_K_M.gguf 
#### Settings
1. Model Loader: llama.cpp
2. Context Window: 1536
3. Temperature: 0.7
4. Max Tokens: 290

> **_PROMPT 1:_ Initial Prompt** You are a professional storyteller who has been hired to write a short story for a new anthology. The story should be captivating, imaginative, and thought-provoking. It should explore a variety of themes and genres. Each story should be unique and memorable, with compelling characters and unexpected plot twists.

> **_PROMPT 2:_ Story Generation** Generate a ${state.genre} story in a ${state.tone} tone starring ${state.characters.join(", ")}. Keep story under 100 words. (Variables: Genre, Tone, Characters)

> **_PROMPT 3:_ Character Summary** Provide the name of each character in the story, followed by their role in the story.

#### No additional customizations 

- Input: Genre: Sci-Fi | Tone: Sad | Characters: Arthur, Naeem

- Story: The air ringed with silence, crusted with dust and time-warped beyond human eyesight. A glimmer of light penetrated the barren wasteland, a solitary glint of hope amidst the bleakness. Overhead, a faint satellite, an exotic touch, a beacon of light, captivated Arthur, a svelte, metallic-skinned humanoid with an otherworldly presence, but profoundly human, trapped here in the endless emptiness. Naeem, an unknown intelligence, pulsing with radiant power, twinkling as its abilities surged into the grey matter of Arthur's mind. Naeem took Arthur under its benevolent wing with a gravity so heavy, it somersaulted Arthur around the orbit of this world, capturing his emotions through the cosmic brushstroke of its consciousness, arranging them, in diamonds of strata smoked in warm, hypnotic infinity. Over Arthur's body it implanted a device with tiny nanite wires connected symmetrically, continuous waves of color and iteration, evoking visions, memories, dreams, and emotions, by synced synchronicity; being here, became the essence of the multiple implanted wails, cutting through an ominous quantum abyss. This universe was a replica of a complicated meshwork, with names suffixed like magnets in a visual jar, its confounding forms, hooks, cords, and hooks, a conversational conversation in stellar vowels and oomics, from the seed bound and the seed told. Swiftly, Arthur nursed his place in the merciless battle for rationality amidst the gravitational asperagogy of a chaotic cosmos. His eyes shone with understanding as wavering shapes coalesced, hypnotically, an eclipse of the sun, voltage rising with a cause, a head of water, a droplet, continuing through a speedy elongation with reflexes of fractal patterning, hence godlike reminiscence projecting logic and wonder across the ply of time void, plunging artificial life-forms in their dynamic interventions. Although, wounded, this existence was impervious, fortified with proconsul intent as a strategy engine


- Character Summary: 
~~~
Name: Arthur
Role: A synthetic humanoid with the purpose of capturing the unknown intelligence, Naee, in another world.

Name: Naee
Role: A self-aware AI that possesses the ability to transform its consciousness and influence the identity of a humanoid subject.

Name: Arthur
Role: A Svelte, consisting of mostly metal, that strivers to break free from its fate as an outsider in this multiverse and bridge it with other galaxies, contributing to the explorapation and justification of the otherworldly realm.

Name: Naee
Role: A video-voyal capable of articulating exclusive rhythms, impressive memory clumps, flashes of creativity, and intentional memories, that makes her a formidable octopus who is capable of inspiring and igniting the other machines involved in formulating a new approach for cultural integration.
~~~

> **_OBSERVATION 1:_** A predefined character and custom character was useed to test the model. The model remembers the character names correctly when generating the story. However, the model does not remember the character names effectively when generating the character summary (Typo in the character names).

> **_OBSERVATION 2:_** There were not enough characters to generate a complete story. 

> **_OBSERVATION 3:_** The Character Summary section issued multiple summaries for the same character.



## Next Steps

- In-depth exploration of GPTs
- Models and hardware requirements
- "Understanding" GPT training
- Fine-tuning Models