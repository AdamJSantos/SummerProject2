import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import GEMINI_API_KEY from "./geminiKey.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/recipeStream", async (req, res) => {
    const { ingredients, mealType, cuisine, cookingTime, complexity } = req.query;

    console.log(req.query);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const prompt = [
        "Generate a recipe that incorporates the following details:",
        `[Ingredients: ${ingredients}]`,
        `[Meal Type: ${mealType}]`,
        `[Cuisine Preference: ${cuisine}]`,
        `[Cooking Time: ${cookingTime}]`,
        `[Complexity: ${complexity}]`,
        "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
        "The recipe should highlight the fresh and vibrant flavors of the ingredients.",
        "Also give the recipe a suitable name in its local language based on cuisine preference.",
    ].join(" ");

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
                res.write(`data: ${JSON.stringify({ action: "stream", content: text })}\n\n`);
            }
        }

        res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
        res.end();

    } catch (error) {
        console.error("Error fetching data from Gemini API:", error);
        res.write(`data: ${JSON.stringify({ action: "error" })}\n\n`);
        res.end();
    }

    req.on("close", () => res.end());
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});