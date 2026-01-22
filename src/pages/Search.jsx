import { useState, useEffect } from "react";
import Horizontal from '../components/Designs/Horizontal'
import SearchResult from '../components/Search/SearchResult'
import SearchHint from '../components/Search/SearchHint'
import SearchTopic from '../components/Search/SearchTopic'

export default function Search() {
    const [searchType, setSearchType] = useState('')
    const [inputText, setInputText] = useState('')
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // Get the endpoint for the topic the user has chosen
    // i.e., area, name, category, or main ingredient
    const getEndpoint = (searchType, query) => {
        const baseUrl = 'https://www.themealdb.com/api/json/v1/1'
        const encodedQuery = encodeURIComponent(query)

        switch (searchType) {
            case 'name':
                return `${baseUrl}/search.php?s=${encodedQuery}`
            case 'ingredient':
                return `${baseUrl}/filter.php?i=${encodedQuery}`
            case 'area':
                return `${baseUrl}/filter.php?a=${encodedQuery}`
            case 'category':
                return `${baseUrl}/filter.php?c=${encodedQuery}`
            default:
                return null
        }
    }

    // Format the ingredients for one recipe from TheMealDB
    const formatTheMealDBIngredients = (meal) => {
        if (!meal) {
            return []
        }

        const ingredients = []

        // Loop through all possible ingredient slots (TheMealDB responses can have up to 20 ingredients)
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]

            // check if the ingredient exists and isn't empty
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    name: ingredient.trim(),
                    // handle cases where there is no value for measure
                    measure: measure ? measure.trim() : ''
                })
            }
        }

        return ingredients
    }

    // Format the recipe objects to have name, image, area, category, instructions, and ingredients
    const formatRecipes = (data) => {
        return data.meals
            .map(meal => ({
                name: meal.strMeal,
                image: meal.strMealThumb,
                category: meal.strCategory,
                area: meal.strArea,
                instructions: meal.strInstructions,
                ingredients: formatTheMealDBIngredients(meal),
            }))
    }

    // In the case where the user chooses area, category, or main ingredient, this function is ran
    // Calling the TheMealDB for those topics only returns recipe names, not recipe information like ingredients or instructions
    // So this function is to get the missing data for a recipe when those certain topics are chosen
    const getRecipeData = async (recipeName) => {
        try {
            // use TheMealDB's recipe search by name endpoint instead of API Ninja's
            const endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipeName)}`
            // make the API call
            const response = await fetch(endpoint)

            // if the response is unsuccessful, throw an error
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // parse the JSON data
            const data = await response.json()

            // TheMealDB returns a list of recipes when searching by name
            // the very first result should be the recipe that was entered by the user
            // check if the recipe was found, then return the first recipe in the list
            if (data && data.meals && data.meals.length > 0) {
                return data.meals[0]
            }

        } catch (error) {
            // handle thrown errors
            console.error('Error:', error.message)
            return null
        }
    }

    // Fill the recipes array with the missing recipe data if it's like the scenario described above
    const fillRecipeData = async (recipes) => {
        const updatedRecipes = []

        // process each recipe to fill in missing data
        for (const recipe of recipes) {
            // check if the recipe is missing inredients or instructions
            if (!recipe.ingredients || !recipe.instructions) {
                // make the API call
                const data = await getRecipeData(recipe.name)

                if (data) {
                    // create an updated recipe object with the required data
                    const updatedRecipe = {
                        ...recipe,
                        instructions: data.strInstructions || recipe.instructions,
                        ingredients: formatTheMealDBIngredients(data),
                        category: data.strCategory,
                        area: data.strArea
                    }

                    // check if the recipe has all the required data, then add it to the array
                    if (updatedRecipe.name && updatedRecipe.image && updatedRecipe.category && updatedRecipe.area) {
                        updatedRecipes.push(updatedRecipe)
                    }
                }
            } else {
                // if the recipe already has the required data, add it to the array without changing anything
                updatedRecipes.push(recipe)
            }
        }

        return updatedRecipes
    }

    // This function is ran when the user enters their search or clicks the search button
    const handleSearch = async (searchType, query) => {
        // reset states on each search
        setRecipes([])
        setError('')
        // start the loader
        setLoading(true)

        try {
            // get the endpoint needed for the searchType
            const endpoint = getEndpoint(searchType, query)

            // make the API call
            const response = await fetch(endpoint)

            // if the response is unsuccessful, throw an error
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // parse the JSON response
            const data = await response.json()

            // TheMealDB returns a JSON object with a 'meals' array that contains many recipes
            const hasRecipes = data.meals && data.meals.length > 0

            // if there were no recipes found, handle the error
            if (!hasRecipes) {
                setError('Error: No recipes found. Try a different search term.')
                setRecipes([])
                return
            }

            // format the recipes
            let formattedRecipes = formatRecipes(data)

            // Only fill recipe data for non-name searches
            // Name searches already return complete data
            if (searchType !== 'name') {
                formattedRecipes = await fillRecipeData(formattedRecipes)
            }

            // update the recipe list with the proper recipes
            setRecipes(formattedRecipes)
        } catch (error) {
            // handle thrown errors
            console.error('Error:', error.message)
            setError('Error: No recipes found. Try a different search term.')
            setRecipes([])
        } finally {
            // stop the loader
            setLoading(false)
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

    return(
        //container for UI formatting on search page
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className={`w-[35%] text-left text-3xl flex flex-col transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                <p className="pb-3">Only remember part of the name of a recipe?</p>
                <p className="py-3">Don't know what you can make with your ingredients?</p>
                <p className="py-3">Want to try something different?</p>
                <p className="py-3">Don't worry! Search for tons of amazing recipes by area, name, category, or main ingredient.</p>
                <p className="py-3">You can get started by simply clicking on the search method you want to use, on the right.</p>
                <p className="py-3">Once you're done searching, click on a recipe to see its detailed information!</p>
                <Horizontal />
        {/* handles search type selector component */}
        {/* displays search options and input field  */}
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <SearchTopic
                    onSearch={handleSearch}
                    searchType={searchType}
                    setSearchType={setSearchType}
                    inputText={inputText}
                    setInputText={setInputText}
                    setError={setError}
                    setRecipes={setRecipes}
                />

                <div className="bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto transition">
                    <SearchHint searchType={searchType} />
                {/* handles error if API fails or user input is invalid */}
                    {error && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1 className="font-medium text-error">{error}</h1>
                        </div>
                    )}
                {/* loops over recipes array and renders SearchResult to show recipe details */}
                    {recipes.map((recipe, idx) => (
                        <SearchResult key={idx} number={idx + 1} name={recipe.name} image={recipe.image} recipeData={recipe} area={recipe.area} category={recipe.category} />
                    ))}
                {/* loads spinner for search buffering */}
                    {loading && (
                        <div className="flex flex-row space-x-5">
                            <p className="text-2xl">Fetching recipes, hang tight!</p>
                            <span className="loading loading-spinner text-primary loading-xl"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}