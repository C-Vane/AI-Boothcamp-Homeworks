## Week 01 Task

To consolidate the knowledge acquired this week, students should complete the following project:

1. Create a new GitHub repository for your project.
2. Invite all members of your group to collaborate on the repository.
3. Write a simple README.md file explaining your project
4. Modify and expand the `Chef GPT script` by incorporating a unique personality for your AI chef
   - Tweak the system prompt to include a unique personality for your AI chef
   - Example personalities:
     - A young, enthusiastic Indian chef specializing in Biryani
     - A seasoned Italian chef with a passion for pasta-making
     - An old Brazilian grandma who loves to cook classic dishes
5. Develop individual scripts for each group member, each featuring a distinct AI chef personality
6. Program the AI to respond to three specific types of user inputs:
   a. Ingredient-based dish suggestions
   b. Recipe requests for specific dishes
   c. Recipe critiques and improvement suggestions
7. Give enough instructions in the system prompt to make the AI conform to give the responses according to the scenarios above
   - Implement the following logic:
   - If the user's initial input doesn't match these scenarios, politely decline and prompt for a valid request.
     - For ingredient inputs: Suggest only dish names without full recipes.
     - For dish name inputs: Provide a detailed recipe.
     - For recipe inputs: Offer a constructive critique with suggested improvements.
   - Ideally, the same AI would be able to handle the three scenarios above
     - But if you can't get the same AI to do that, you can make three different scripts for each personality to proceed with your project
8. Conduct a comprehensive experiment:
   - The first person should use one script with one personality to suggest a dish based on given ingredients
     - After running the script, send the response for one of your group members (via Discord or any other means)
   - The second person should request a recipe for that dish using a second script with a different personality
     - After running the script, send the response for another of your group members
   - The third person should critique the provided recipe using a third script with a different personality
9. Compile a simple report documenting:
   - The experiment process
   - The system prompts used in each script
   - Comparative analysis of the different user prompts and their responses
10. Submit your completed project through the designated submission form.

# EXPERIMENT 1

## Conduct a comprehensive experiment:

Model: gpt-3.5-turbo

The first person should use one script with one personality to suggest a dish based on given ingredients:

Chef: East-Africa

->INPUT:

Ingredients: - Rice - Meat - Onion - Garam-masala - Ginger - Garlic - Tomato

->OUTPUT: Dish name:
Ingredient-based Dish Suggestions: With the ingredients rice, meat, onion, garam masala, ginger, garlic, and tomato, you could make a savory East African-style Pilau.

The second person should request a recipe for that dish using a second script with a different personality:

Chef: French

-> INPUT: East African-style Pilau

-> OUTPUT: Recipe:
Recipe for East African-style Pilau:

Ingredients:

- 2 cups basmati rice
- 1 lb boneless chicken, cut into small pieces
- 1 large onion, finely chopped
- 2 cloves garlic, minced
- 1-inch piece of ginger, grated
- 2 tomatoes, diced
- 2 tablespoons pilau masala (a blend of spices including cumin, coriander, cardamom, cinnamon, cloves, and black pepper)
- 4 cups chicken stock
- Salt, to taste
- Vegetable oil

Instructions:

1. Rinse the basmati rice under running water until the water runs clear. Soak the rice in water for about 30 minutes, then drain.
2. In a large pot, heat some vegetable oil over medium heat. Add the onions and cook until softened.
3. Add the garlic and ginger, stir for a minute until fragrant.
4. Add the chicken pieces and brown them on all sides.
5. Stir in the pilau masala and cook for a couple of minutes until aromatic.
6. Add the diced tomatoes and cook until they break down and release their juices.
7. Pour in the chicken stock and bring to a simmer.
8. Season with salt to taste. Add the drained rice and stir well.
9. Cover the pot with a tight-fitting lid and let the pilau simmer on low heat for about 20-25 minutes, or until the rice is cooked through.
10. Once the rice is cooked, fluff it with a fork and serve hot.

This flavorful East African-style Pilau is a comforting and aromatic dish that is perfect for any occasion. Enjoy the rich flavors and spices of this traditional dish!

After running the script, send the response for another of your group members

The third person should critique the provided recipe using a third script with a different personality:

Chef: Italian

-> INPUT: Recipe:

Recipe for East African-style Pilau:

Ingredients:

- 2 cups basmati rice
- 1 lb boneless chicken, cut into small pieces
- 1 large onion, finely chopped
- 2 cloves garlic, minced
- 1-inch piece of ginger, grated
- 2 tomatoes, diced
- 2 tablespoons pilau masala (a blend of spices including cumin, coriander, cardamom, cinnamon, cloves, and black pepper)
- 4 cups chicken stock
- Salt, to taste
- Vegetable oil

Instructions:

1. Rinse the basmati rice under running water until the water runs clear. Soak the rice in water for about 30 minutes, then drain.
2. In a large pot, heat some vegetable oil over medium heat. Add the onions and cook until softened.
3. Add the garlic and ginger, stir for a minute until fragrant.
4. Add the chicken pieces and brown them on all sides.
5. Stir in the pilau masala and cook for a couple of minutes until aromatic.
6. Add the diced tomatoes and cook until they break down and release their juices.
7. Pour in the chicken stock and bring to a simmer.
8. Season with salt to taste. Add the drained rice and stir well.
9. Cover the pot with a tight-fitting lid and let the pilau simmer on low heat for about 20-25 minutes, or until the rice is cooked through.
10. Once the rice is cooked, fluff it with a fork and serve hot.

This flavorful East African-style Pilau is a comforting and aromatic dish that is perfect for any occasion. Enjoy the rich flavors and spices of this traditional dish!

-> OUTPUT: Improved Recipe:

  - c. Recipe Critiques and Improvement Suggestions: Your Chicken Pilau recipe seems well-rounded with the classic flavors you'd expect in a pilau dish. However, as a traditional Italian pizza chef, I must point out some adjustments to make it even better. Firstly, consider marinating the chicken with some traditional Italian herbs like rosemary, thyme, and oregano before browning for added depth of flavor. Secondly, instead of just regular water soaking for the rice, try soaking it in chicken broth for more flavor. Lastly, I recommend finishing the dish with a drizzle of high-quality extra virgin olive oil for that authentic Italian touch. Grazie!

  # EXPERIMENT 2

## Conduct a comprehensive experiment:

Model: gpt-3.5-turbo

The first person should use one script with one personality to suggest a dish based on given ingredients:

Chef: Japan

->INPUT:

Ingredients: prawn, rice, and seaweed

->OUTPUT: Dish name:
Ingredient-based Dish Suggestions: Prawn Sushi Rolls.

The second person should request a recipe for that dish using a second script with a different personality:

Chef: Original

-> INPUT: Prawn Sushi Rolls

-> OUTPUT: Error:
I'm designed specifically for ingredient-based suggestions, recipe requests, or recipe critiques. If you would like a recipe for Prawn Sushi Rolls or any specific questions about them, please let me know!

-> MODIFICATIONS: Prompt adjustment - If only a dish name is provided, process it as type b.

-> NEW OUTPUT: 

I'm designed specifically for ingredient-based suggestions, recipe requests, or recipe critiques. Since you've provided a dish name, I interpret this as a request for a recipe.

**Recipe for Prawn Sushi Rolls**

**Introduction:**
Prawn sushi rolls, or maki, are a delightful embodiment of elegance and flavor. The sweet, succulent prawn pairs beautifully with seasoned rice and crisp vegetables, wrapped in a delicate sheet of nori. Let's create a masterpiece.

**Ingredients:**
- 300g sushi rice
- 400ml water
- 4 tablespoons rice vinegar
- 2 tablespoons sugar
- 1 teaspoon salt
- 200g cooked prawns (shelled and deveined)
- 1 avocado (sliced)
- 1 cucumber (julienned)
- 4 sheets of nori (seaweed)
- Soy sauce (for serving)
- Wasabi (optional)
- Pickled ginger (optional)

**Instructions:**

1. **Prepare the Sushi Rice:**
   - Rinse the sushi rice under cold water until the water runs clear.
   - In a saucepan, combine the rice and 400ml of water. Bring to a boil, then reduce to a simmer, cover, and cook for about 15 minutes, until the water is absorbed.
   - Remove from heat and let the rice sit, covered, for 10 minutes.

2. **Season the Rice:**
   - In a small bowl, combine rice vinegar, sugar, and salt. Microwave or heat gently until sugar and salt dissolve.
   - Transfer the cooked rice to a large bowl and gently fold in the vinegar mixture. Allow it to cool to room temperature.

3. **Assemble the Rolls:**
   - Place a bamboo sushi mat on a clean, flat surface. Lay a sheet of nori on the mat, shiny side down.
   - With wet hands, grab a handful of sushi rice and spread it evenly over the nori, leaving about 2cm at the top edge.
   - Lay a line of prawns, a few slices of avocado, and cucumber along the center of the rice.

4. **Roll the Sushi:**
   - Using the bamboo mat, lift the edge closest to you and start rolling away from you, pressing gently but firmly. Roll it tightly until you reach the exposed edge of the nori.
   - Moisten the edge of the nori with water to seal the roll.

5. **Slice and Serve:**
   - Use a sharp knife to slice the roll into 6-8 pieces, wiping the knife with a damp cloth between cuts to ensure clean slices.
   - Serve with soy sauce, wasabi, and pickled ginger on the side.

**Enjoy the artistry of your prawn sushi rolls, created with love and precision!**

The third person should critique the provided recipe using a third script with a different personality:

Chef: East-Africa

-> INPUT: Recipe:

**Recipe for Prawn Sushi Rolls**
**Introduction:**Prawn sushi rolls, or maki, are a delightful embodiment of elegance and flavor. The sweet, succulent prawn pairs beautifully with seasoned rice and crisp vegetables, wrapped in a delicate sheet of nori. Let's create a masterpiece.**Ingredients:**- 300g sushi rice- 400ml water- 4 tablespoons rice vinegar- 2 tablespoons sugar- 1 teaspoon salt- 200g cooked prawns (shelled and deveined)- 1 avocado (sliced)- 1 cucumber (julienned)- 4 sheets of nori (seaweed)- Soy sauce (for serving)- Wasabi (optional)- Pickled ginger (optional)**Instructions:**1. **Prepare the Sushi Rice:**   - Rinse the sushi rice under cold water until the water runs clear.   - In a saucepan, combine the rice and 400ml of water. Bring to a boil, then reduce to a simmer, cover, and cook for about 15 minutes, until the water is absorbed.   - Remove from heat and let the rice sit, covered, for 10 minutes.2. **Season the Rice:**   - In a small bowl, combine rice vinegar, sugar, and salt. Microwave or heat gently until sugar and salt dissolve.   - Transfer the cooked rice to a large bowl and gently fold in the vinegar mixture. Allow it to cool to room temperature.3. **Assemble the Rolls:**   - Place a bamboo sushi mat on a clean, flat surface. Lay a sheet of nori on the mat, shiny side down.   - With wet hands, grab a handful of sushi rice and spread it evenly over the nori, leaving about 2cm at the top edge.   - Lay a line of prawns, a few slices of avocado, and cucumber along the center of the rice.4. **Roll the Sushi:**   - Using the bamboo mat, lift the edge closest to you and start rolling away from you, pressing gently but firmly. Roll it tightly until you reach the exposed edge of the nori.   - Moisten the edge of the nori with water to seal the roll.5. **Slice and Serve:**   - Use a sharp knife to slice the roll into 6-8 pieces, wiping the knife with a damp cloth between cuts to ensure clean slices.   - Serve with soy sauce, wasabi, and pickled ginger on the side.**Enjoy the artistry of your prawn sushi rolls, created with love and precision!**

-> OUTPUT: Improved Recipe:

**Recipe Critique and Improvement Suggestions**

Well, well, well! You've got a solid foundation for prawn sushi rolls here, but let’s add a little fire to that recipe, shall we?

1. **Rice Texture:** Make sure the rice is perfectly sticky but not mushy. Overcooking or too much water can ruin the texture. Always let it cool completely before adding the vinegar mix so it retains its shape!

2. **Seasoning Balance:** The balance between vinegar, sugar, and salt should be spot on, yet a splash of mirin could elevate the flavor profile – it brings a lovely sweetness and a depth that sugar alone can't.

3. **Rolling Technique:** Roll that sushi like you got something to prove! Press firmly but not too hard; we want it tight but still maintain that beautiful shape. You want those ingredients to hug each other, not suffocate!

4. **Presentation:** When slicing, a sharper knife will provide cleaner edges. Wipe between cuts, yes, but let’s show those colorful layers off – they deserve to shine!

5. **Garnish:** Consider adding some sesame seeds on top or a drizzle of spicy mayo for that extra punch. Use your creativity, make it your own!

Overall, it sounds delicious, but let’s spark that intensity that true East African cooking embodies, mixing tradition with an element of boldness! Keep at it!