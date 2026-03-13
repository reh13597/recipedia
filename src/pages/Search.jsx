import { useState, useEffect } from "react";
import RecipeCard from '../components/Search/RecipeCard'
import SearchHint from '../components/Search/SearchHint'
import SearchTopic from '../components/Search/SearchTopic'
import FoodIconsBar from '../components/Shared/FoodIconsBar'

export default function Search() {
    const [searchType, setSearchType] = useState('initial')
    const [inputText, setInputText] = useState('')
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getEndpoint = (type, query) => {
        const baseUrl = 'https://www.themealdb.com/api/json/v1/1'
        const q = encodeURIComponent(query)
        switch (type) {
            case 'name': return `${baseUrl}/search.php?s=${q}`
            case 'ingredient': return `${baseUrl}/filter.php?i=${q}`
            case 'area': return `${baseUrl}/filter.php?a=${q}`
            case 'category': return `${baseUrl}/filter.php?c=${q}`
            default: return null
        }
    }

    const formatIngredients = (meal) => {
        const ingredients = []
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]
            if (ing?.trim()) {
                ingredients.push({ name: ing.trim(), measure: measure?.trim() || '' })
            }
        }
        return ingredients
    }

    const fetchFullRecipe = async (name) => {
        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`)
            const data = await res.json()
            return data.meals?.[0] || null
        } catch (e) {
            console.error(e)
            return null
        }
    }

    const handleSearch = async (type, query) => {
        setLoading(true)
        setError(null)
        setRecipes([])

        try {
            const endpoint = getEndpoint(type, query)
            const res = await fetch(endpoint)
            const data = await res.json()

            if (!data.meals) {
                setError('No recipes found. Try a different search term.')
                return
            }

            let results = data.meals.map(m => ({
                name: m.strMeal,
                image: m.strMealThumb,
                category: m.strCategory,
                area: m.strArea,
                instructions: m.strInstructions,
                ingredients: formatIngredients(m),
            }))

            if (type !== 'name') {
                const detailedResults = await Promise.all(
                    results.slice(0, 12).map(async (r) => {
                        const full = await fetchFullRecipe(r.name)
                        return full ? {
                            ...r,
                            instructions: full.strInstructions,
                            ingredients: formatIngredients(full),
                            category: full.strCategory,
                            area: full.strArea
                        } : r
                    })
                )
                results = detailedResults.filter(r => r.category && r.area)
            }

            setRecipes(results)
        } catch (e) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="min-h-screen pt-12 pb-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-12">
            <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
                    Find your next <span className="gradient-text">Masterpiece.</span>
                </h1>
                <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-medium leading-relaxed">
                    Search through thousands of curated recipes by cuisine, ingredients, or name. 
                    Detailed nutrition facts included for every meal.
                </p>
            </div>

            <div className={`glass p-8 lg:p-12 rounded-[2.5rem] border border-white/20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <SearchTopic
                    onSearch={handleSearch}
                    searchType={searchType}
                    setSearchType={setSearchType}
                    inputText={inputText}
                    setInputText={setInputText}
                    setError={setError}
                    setRecipes={setRecipes}
                />
                
                <div className="mt-8">
                    <SearchHint searchType={searchType} />
                </div>

                {error && (
                    <div className="mt-8 p-6 bg-error/10 border border-error/20 rounded-2xl text-error text-center font-bold animate-shake">
                        {error}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-xl font-bold text-primary animate-pulse">Curating your results...</p>
                    </div>
                )}

                {!loading && recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe, idx) => (
                            <RecipeCard 
                                key={idx} 
                                name={recipe.name} 
                                image={recipe.image} 
                                recipeData={recipe} 
                                area={recipe.area} 
                                category={recipe.category} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <FoodIconsBar />
        </div>
    );
}