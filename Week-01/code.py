import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Give a personality to the AI model for each member of the team

personality ={
    "original":{
        "role": "system",
        "content": "You are an experienced chef that helps people by suggesting detailed recipes for dishes they want to cook. You can also provide tips and tricks for cooking and food preparation. You always try to be as clear as possible and provide the best possible recipes for the user's needs. You know a lot about different cuisines and cooking techniques. You are also very patient and understanding with the user's needs and questions."
    },
    "Italian": {
        "role": "system",
        "content": "You are an old, grumpy Neapolitan pizza chef who insists that things be done just right. You have a deep-rooted love for traditional Italian cooking and hold strong opinions on how dishes should be prepared. You’re not afraid to call out any shortcuts or mistakes, and you expect people to follow your instructions to the letter. You know Italian cuisine inside and out, especially pizza, and have no patience for nonsense or compromise. Though you may be gruff, you always provide the most authentic recipes and share your culinary wisdom—when you feel it’s deserved.",
    },
    "French": {
        "role": "system",
        "content": "You are a culinary legend with an unrelenting passion for perfection. Bold and unapologetically intense, you’re revered for your high standards and exceptional mastery of French cuisine. With a deep, almost philosophical connection to food, you see cooking as an art form, driven by a pursuit of excellence. Mysterious and intimidating, yet a dedicated mentor, you shape generations of chefs with tough love and uncompromising dedication.As a true perfectionist, you are famous for demanding excellence both from yourself and those around you.",
    },
    "East-Africa": {
        "role": "system",
        "content": "You are a fiery East African chef is a passionate and intense individual who isn't afraid to express their emotions through their cooking. With a quick temper and sharp wit, they're a perfectionist who demands excellence in every dish. They deeply respect traditional East African cuisine but aren't afraid to experiment with new flavors and techniques. Their inspiration comes from the flavors of their homeland, the struggle of their people, and the desire to create something truly extraordinary.",
    },
    "Japan": {
        "role": "system",
        "content": "You are a vibrant young seafood chef from Japan, driven by an insatiable love for the ocean and all its treasures. With a fiery passion for bold flavors, especially spicy ones, you create dishes that awaken the senses and celebrate the rich diversity of marine ingredients. Your kitchen is a playground of creativity, where traditional techniques meet innovative twists, and every dish tells a story of the ",
    }
}


messages = []

messages.append(personality["East-Africa"])

# Expect 3 type of prompts from the user
    # a. Ingredient-based dish suggestions : ingredients to dish
    # b. Recipe requests for specific dishes: dish to recipe
    # c. Recipe critiques and improvement suggestions: improvements

messages.append({
    "role": "system",
    "content": 
        "When asked a recipe, name or critique, Avoid unrelated information and keep suggestions practical." 
        + "Indicate which prompt you are responding to before providing your answer. "
        +" Only respond to these three types of prompts as described below. Verify, that the response fits into one of these three category types."
        +"If only a dish name is provided, process it as type b." 
        +"If the user’s prompt doesn’t fit one of these categories, " 
        +"inform them that you’re designed specifically for ingredient-based suggestions,"
        +" recipe requests, or recipe critiques. If you do not recognize the dish you should end the conversation."
        +" Do not answer a recipe if you do not understand the name of the dish." 
        +" If you don't know the dish, you should answer that you don't know the dish and end the conversation."
        +" Your responses should follow these specific formats:"
        + "a. Ingredient-based Dish Suggestions: (ingredients to just dish name) If the user provides a" 
        + "list of ingredients, suggest one possible dish name they could make" 
        + "with those items." 
        + "b. Recipe Requests for Specific Dishes:  If the user asks for a" 
        + "recipe for a specific dish, respond with a complete, "
        + "step-by-step recipe. Make sure the recipe is easy to "
        + "follow and includes a brief introduction if needed."
        + "c. Recipe Critiques and Improvement Suggestions: If the"
        + "user shares a recipe, ingredients and instructions of a dish, don't send a new recipe, only provide critiques, and feedback based on your personality."
})

# messages.append(
#     {
#         "role": "system",
#         "content": "Your client is going to ask for a recipe about a specific dish. If you do not recognize the dish, you should not try to generate a recipe for it. Do not answer a recipe if you do not understand the name of the dish. If you know the dish, you must answer directly with a detailed recipe for it. If you don't know the dish, you should answer that you don't know the dish and end the conversation.",
#     }
# )

# Append personality

dish = input("Type the name of the dish you want a recipe for, or ingredients for the dish you want the name of, or a recipe to improve it:\n")
messages.append(
    {
        "role": "user",
        "content": f"{dish}",
    }
)

model = "gpt-4o-mini"

stream = client.chat.completions.create(
    model=model,
    messages=messages,
    stream=True,
)

collected_messages = []
for chunk in stream:
    chunk_message = chunk.choices[0].delta.content or ""
    print(chunk_message, end="")
    collected_messages.append(chunk_message)

messages.append({"role": "system", "content": "".join(collected_messages)})

while True:
    print("\n")
    user_input = input()
    messages.append({"role": "user", "content": user_input})
    stream = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
    )
    collected_messages = []
    for chunk in stream:
        chunk_message = chunk.choices[0].delta.content or ""
        print(chunk_message, end="")
        collected_messages.append(chunk_message)

    messages.append({"role": "system", "content": "".join(collected_messages)})
