import { useState, useEffect } from "react";
import Horizontal from '../components/Designs/Horizontal'
import RandomRecipe from '../components/Search/SearchResult'

export default function Indecisive() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [recipes, setRecipes] = useState([])
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Format the ingredients for one recipe from TheMealDB
    // exact same function as formatTheMealDBIngredients in Search.jsx
    const formatIngredients = (meal) => {
        if (!meal) {
            return []
        }

        const ingredients = []

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]

            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    name: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                })
            }
        }

        return ingredients
    }

    // Check if a recipe has all the required data
    const isRecipeComplete = (meal) => {
        return (
            meal.strMeal && meal.strMeal.trim() &&
            meal.strMealThumb && meal.strMealThumb.trim() &&
            meal.strCategory && meal.strCategory.trim() &&
            meal.strArea && meal.strArea.trim()
        )
    }

    // Format a recipe to have name, image, area, category, instructions, and ingredients
    const formatRecipe = (meal) => {
        return {
            name: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: formatIngredients(meal),
        }
    }

    // Fetch a random recipe
    const fetchRecipe = async () => {
        // make the API call
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")

        // if the response is unsuccessful, throw an error
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        // parse the JSON data
        const data = await response.json()

        // if there were no recipes found, throw an error
        if (!data || !data.meals || data.meals.length === 0) {
            throw new Error('No recipe data received. Try again.')
        }

        // return the single random recipe (for TheMealDB, recipes are returned in a list, even if there's only one recipe)
        return data.meals[0]
    }

    // This function is ran when the user clicks the button
    const handleGeneration = async () => {
        // reset states on button click
        setRecipes([])
        setError('')
        // start the loader
        setLoading(true)

        try {
            const recipes = []

            // generate 3 random recipes and add them to the array
            for (let i = 0; i < 3; i++) {
                recipes.push(fetchRecipe())
            }

            // wait for all 3 recipe requests finish at the same time
            const meals = await Promise.all(recipes)

            // process the recipe data
            const formattedRecipes = meals
                // filter out recipes with missing data
                .filter(meal => isRecipeComplete(meal))
                .map((meal) =>
                    formatRecipe(meal)
            )

            // update the recipe list with the proper recipes
            setRecipes(formattedRecipes)
        } catch (err) {
            // catch any errors and handle them
            // console.error('Error:', err.message)
            setError('Error: Failed to fetch recipes. Please try again.')
            setRecipes([])
        } finally {
            // stop the loader
            setLoading(false)
            // set count to 1 to move out of the initial page load state
            setCount(1)
        }
    }

    useEffect(() => {
        // starts a timer, then after 300 ms, the state of isVisible changes
        // this is used for the animation of components on page load
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        // if the component unmounts or re-renders before the timeout finishes,
        // the timer is cleared to prevent memory leaks and warnings
        return () => {
            clearTimeout(showTimeout);
        }
    })

    return (
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className={`w-[35%] text-left text-3xl flex flex-col transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                <p className="pb-3">Don't know what you want to eat today?</p>
                <p className="py-3">Can't settle on a recipe?</p>
                <p className="py-3">Let us do the work for you!</p>
                <div className="py-10">
                    <button
                        className="mt-2 btn btn-primary w-[80%] rounded-full shadow-xl text-lg transition-all duration-300 hover:scale-105"
                        onClick={handleGeneration}
                        disabled={loading}
                        >
                        Surprise Me!
                    </button>
                </div>
                <Horizontal />
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <div className={`bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex flex-row justify-between">
                        <div className="space-y-6 w-full">
                            {recipes.map((recipe, idx) => (
                                <div key={idx}>
                                    <RandomRecipe key={idx} number={idx + 1} name={recipe.name} image={recipe.image} recipeData={recipe} area={recipe.area} category={recipe.category} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* if the user just landed on this page, display this message */}
                    {recipes.length === 0 && !error && count === 0 && (
                        <div className={`bg-base-200 p-6 rounded-xl shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
                            <h1>Looks like you haven't clicked the button yet. Click it on the left!</h1>
                        </div>
                    )}
                    {error && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1 className="font-medium text-error">{error}</h1>
                        </div>
                    )}
                    {loading && (
                        <div className="flex flex-row space-x-5">
                            <p className="text-2xl">Fetching recipes, hang tight!</p>
                            <span className="loading loading-spinner text-primary loading-xl"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
