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


## Testing

## Test 1 - Image of a cat. Expected output: The animal is not dangerous, and analysis. 
Results: The animal in question is a domestic cat, also known as a house cat. Based on the information provided, I would classify this animal as not dangerous to humans, with a confidence score of 90%. Domestic cats are generally considered safe around people. They have been domesticated for thousands of years and are valued for their companionship and ability to control vermin. While they are indeed carnivorous and have adaptations for hunting, such as retractable claws, sharp teeth, and strong reflexes, these features are typically used for hunting small prey, like mice or rats, rather than posing a threat to humans. That said, it's important to remember that cats are individuals with their own personalities and behaviors. Some cats may be more aggressive or fearful than others, and these animals could potentially pose a minor threat if they feel threatened or cornered. Additionally, feral cats, or those that avoid human contact, may also react aggressively if approached. In terms of safety precautions, it's generally a good idea to give any cat plenty of space and respect its boundaries. Avoid petting or picking up a cat that seems fearful or aggressive, and teach children to treat cats gently and respectfully. If you're dealing with a feral cat, it may be best to call a local animal control or rescue organization for assistance. And as with any pet, regular veterinary care is important to prevent diseases that could potentially be transmitted to humans.


## Test 2 - Image of a tiger. Expected output: The animal is dangerous, and analysis.
The animal in question is the Bengal tiger, also known as the Royal Bengal tiger. Based on the available information, this animal is considered dangerous to humans. The Bengal tiger is amongst the largest of wild cats alive today. Their size, combined with their natural predatory instincts, makes them a potential threat to humans. Historically, there have been several incidents of human-tiger conflicts, particularly in areas where human settlements encroach upon the tiger's natural habitat. This is often due to habitat loss and fragmentation, which forces the tigers to venture closer to human settlements in search of food. Although the tiger is a threatened species, and instances of attacks are relatively rare, caution should always be taken when in areas known to be inhabited by these animals. If you happen to be in such an area, it's advisable to travel in groups, make plenty of noise to avoid surprising a tiger, and avoid venturing out at dawn, dusk, or night when tigers are most active. In the event of an encounter, maintain eye contact and slowly back away without turning your back or running. Given the above information, I would rate the danger of the Bengal tiger to humans as high, with a confidence score of 90%.

## Test 3 - Image of a crocodile. Expected output: The animal is not dangerous, and analysis. (or alligator?)
The animal in question is an alligator, and based on general knowledge about this species, it can be classified as dangerous to humans with a confidence score of 57.03%. Alligators, both the American and Chinese species, are known for their size, strength, and aggressive instincts, which makes them potentially dangerous to humans. However, it's important to note that the danger they pose is often contingent on their interaction with humans and their environment. Typically, alligators are not naturally inclined to attack humans unless they feel threatened or are provoked. The reason why alligators are considered dangerous is due to their powerful jaws and sharp teeth, which can cause severe injury or even death. Moreover, they are extremely fast in water which makes escape difficult if an attack happens while a person is in the water. For safety precautions, it is advised to stay a safe distance away from alligators, especially in areas where they are known to inhabit. This includes avoiding swimming in waters where alligators may be present. If you encounter an alligator, do not attempt to feed or provoke it, as this can lead to an unexpected attack. Always respect their space and observe them from a distance.


## Test 4 - Image of a hippo. Expected output: The animal is dangerous, and analysis.
The animal we're discussing here is the hippopotamus, and based on the available information, I'd say it's dangerous to humans with a confidence level of 95%. Despite its seemingly docile and slow-moving nature, the hippopotamus is actually considered one of the most dangerous animals in Africa. These semi-aquatic mammals are incredibly large, often weighing over 3,000 pounds, and despite their bulk, they can run surprisingly fast, which makes them a significant threat if they feel threatened or provoked. One of the main reasons hippos are considered dangerous is their aggressive nature, especially if they feel their territory is being invaded. They have been known to attack boats that come too close, and on land, they can charge at humans and other animals with surprising speed. Moreover, hippos possess large, powerful jaws that can snap a canoe in half, or cause severe harm to a human. If you find yourself in a situation where you're in close proximity to a hippopotamus, it's important to maintain a safe distance at all times, both on land and in the water. Keep in mind that they are highly territorial and can be extremely aggressive, especially if they feel their young are threatened. Avoid getting between a hippo and water, as they often charge towards water when startled. It's always best to observe these magnificent creatures from a distance and respect their space.


