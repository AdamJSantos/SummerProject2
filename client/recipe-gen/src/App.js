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
    </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
