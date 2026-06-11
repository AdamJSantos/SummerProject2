import GEMINI_API_KEY from "./geminiKey.js";

const express = require ('express');
const cors = require ('cors');
const gemini = require ('./routes/gemini');

const app = express ();
const PORT = process.env.PORT || 3001;

app.use (cors ());

app.get("/recipeStream", (req, res) => {
    const ingredients = req.query.ingredients;
    const mealType = req.query.mealType;
    const cuisine = req.query.cuisine;
    const cookingTime = req.query.cookingTime;
    const complexity = req.query.complexity;

    console.log(req.query)

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (chunk) => {
        let chunkResponse;
        if(chunk.choices[0].finish_reason === 'stop') {
            res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
        } else {
            if (chunk.choices[0].delta.role && 
                chunk.choices[0].delta.role === "assistant"
            ) {
                chunkResponse = {
                    action : "start",
                };
            } else {
                chunkResponse = {
                    action : "stream",
                    content : chunk.choices[0].delta.content,
                };
            }
            res.write(`data: ${JSON.stringify(chunkResponse)} \n\n`);
        }
    };

    const prompt = [];
    prompt.push("Generate a recipe that incorporates the following details:");
    prompt.push(`[Ingredients: ${ingredients}]`);
    prompt.push(`[Meal Type: ${mealType}]`);
    prompt.push(`[Cuisine Preference: ${cuisine}]`);
    prompt.push(`[Cooking Time: ${cookingTime}]`);
    prompt.push(`[Complexity: ${complexity}]`);
    prompt.push(
        "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided."
    );
    prompt.push(
        "The recipe should highlight the fresh and vibrant flavors of the ingredients."
    );
    prompt.push(
        "Also give the recipe a suiable name in its local languagebased on cuisine preference."
    );

    const messages = [
        {
        role: "system",
        content: prompt.join(" "),
        },
    ];
    fetchGemniniCompletionsStream(messages, sendEvent);

    // Clear interval and close connection on client disconnect
    req.on("close", () => {
        res.end();
    });
});

    
async function fetchGemniniCompletionsStream(messages, callback) {
    const GEM_API_KEY = GEMINI_API_KEY;
    const gemini = new Gemini({apiKey: GEM_API_KEY});
    const aiModel = 'gemini-1.5-pro';
        
    try {
        const completion = gemini.chat.completions.create({
            model: aiModel,
            messages: messages,
            temperature: 1,
            stream: true,
        })

        for await (const chunk of completion) {
            callback(chunk);
        }
    } catch (error) {
        console.error("Error fetching data from Gemini API:", error);
        throw new Error("Error fetching data from Gemini API");
    }
}

app.listen (PORT, () => {
  console.log (`Server is running on port ${PORT}`);
}); 