import './App.css';
import React, { useEffect, useRef, useState } from 'react';

const RecipeCard = ({onSubmit}) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setmealType] = useState("");
  const [cuisine, setcuisine] = useState("");
  const [cookingTime, setcookingTime] = useState("");
  const [complexity, setComplexity] = useState("");

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity
    };
    onSubmit(recipeData);
  };

  return (
    <div className='w-[400px] border rounded-lg overflow-hidden shawdow-lg'>
      <div className="p-6 py-4">
      <div className="font-bold text-xl mb-2">Recipe Generator</div>
        <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="ingredients"
        >
          Ingredients:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="ingredients"
          type="text"
          placeholder="Enter ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="mealType"
        >
          Meal Type:
        </label>
        <select
          className="black appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          id="mealType"
          value={mealType}
          onChange={(e) => setmealType(e.target.value)}
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="cuisine"
        >
          Cuisine Preference:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="cuisine"
          type="text"
          placeholder="Enter cuisine preference"
          value={cuisine}
          onChange={(e) => setcuisine(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="cookingTime"
        >
          Cooking Time:
        </label>
        <select
          className="black appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          id="cookingTime"
          value={cookingTime}
          onChange={(e) => setcookingTime(e.target.value)}
        >
          <option value="0-30">0-30 minutes</option>
          <option value="30-60">30-60 minutes</option>
          <option value="60+">60+ minutes</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="complexity"
        >
          Complexity:
        </label>
        <select
          className="black appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          id="complexity"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>
      <div className="px-6 py-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleSubmit}
        >
          Generate Recipe
        </button>
      </div>
    </div>
    </div>
  );
}

function App() {
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");

  let eventSourceRef = useRef(null);

  useEffect(() => {
    if (recipeData) {
      closeEventStream();
      intializeEventStream();
    }
    }, [recipeData]);

    const intializeEventStream = () => {
        const recipeInputs = {... recipeData};
      
        const queryParams = new URLSearchParams(recipeInputs).toString();
        const url = 'http://localhost:3001/recipeStream?${queryParams}';
        eventSourceRef.current = new EventSource(url);
        eventSourceRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if(data.action === "close") {
            closeEventStream();
          } else if (data.action === 'chunk') {
            setRecipeText((prev) => prev + data.chunk);
          }
      }

      eventSourceRef.current.onerror = () => {
        eventSourceRef.current.close();
      };
    }

    const closeEventStream = () => {
      if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      }
    }

  async function onSubmit(data) {
    setRecipeText('')
    setRecipeData(data);
  }

  return (
    <div className="App">
      <div className="flex flex-row h-full my-4 gap-2 justify-center">
        <RecipeCard onSubmit={onSubmit} />
        <div className="w-[400px] h-[565px] text-xs text-gray-600 p-4 border rounded-lg shawdow-xl whitespace-pre-wrap overflow-y-auto">
          {recipeText}
        </div>
      </div>
    </div>
  );
}

export default App;
