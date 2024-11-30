# Weekend Project

To consolidate this week's learning, complete the following project:

1. Create a GitHub repository for your project
2. Add all members of your group as collaborators
3. Create a README.md file with the description of your project
4. Create a new application from scratch using NextJS
5. Create a page with a single input field for the user to upload an image
   - Ideally, the user would upload a picture of an animal
6. Add a button to upload the image
7. Use a Computer Vision model to detect and classify the animal
   - The model should be able to detect at least 10 different animals of your choice
   - The model should return the name of the animal detected (classification)
8. Create an AI Agent that can find a page in [Wikipedia](https://wikipedia.org/) with the name of the animal, retrieve the description, and determine if the animal is dangerous
9. If the uploaded image contains an animal, pass the image to the AI Agent and await the answer
10. Display the answer on the page, indicating whether the animal in the picture is dangerous
11. Submit your project in the submission form

## Backend

- Clip as a service

  #### How to run it

         ```bash
         cd /Users/vanessacattabiani/Documents/Projects/AI-boothcamp/AI-Boothcamp-Homeworks/Week-05/animal-danger-detection/backend/
         ```

         ```bash
         pip install -r requirements.txt
         ```

         ```bash
         python app.py
         ```

## Frontend

- NextJS

  #### How to run it

      ```bash
      cd /Users/vanessacattabiani/Documents/Projects/AI-boothcamp/AI-Boothcamp-Homeworks/Week-05/animal-danger-detection

      pnpm install
      pnpm run dev
      ```

## Features
