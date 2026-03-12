import { useState, useEffect } from "react";
import RecipeCard from '../components/Search/RecipeCard';
import { FaDice, FaMagic, FaUtensils, FaQuestionCircle } from 'react-icons/fa';
import FoodIconsBar from '../components/Shared/FoodIconsBar';

export default function Indecisive() {
    // ... rest of code ...
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const formatIngredients = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ing?.trim()) {
                ingredients.push({ name: ing.trim(), measure: measure?.trim() || '' });
            }
        }
        return ingredients;
    }

    const fetchRandomRecipe = async () => {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data.meals[0];
    }

    const handleGeneration = async () => {
        setLoading(true);
        setError("");
        setRecipes([]);
        
        try {
            const mealPromises = Array.from({ length: 3 }, fetchRandomRecipe);
            const meals = await Promise.all(mealPromises);
            
            const formatted = meals.map(meal => ({
                name: meal.strMeal,
                image: meal.strMealThumb,
                category: meal.strCategory,
                area: meal.strArea,
                instructions: meal.strInstructions,
                ingredients: formatIngredients(meal),
            }));

            setRecipes(formatted);
            setHasGenerated(true);
        } catch (err) {
            setError("Failed to fetch recipes. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-16 flex flex-col items-center">
            {/* Hero Section */}
            <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
                    Feeling <span className="gradient-text">Indecisive?</span>
                </h1>
                <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-medium leading-relaxed">
                    Can't decide what to cook? Let fate choose your next culinary adventure. 
                    Roll the dice to get three perfectly random recipe suggestions.
                </p>
                
                <div className="pt-8">
                    <button
                        onClick={handleGeneration}
                        disabled={loading}
                        className="btn btn-primary btn-lg rounded-[2rem] px-12 transition-all duration-500 hover:scale-110 gap-4 group"
                    >
                        {loading ? <span className="loading loading-spinner"></span> : <FaDice className="group-hover:rotate-180 transition-transform duration-500" size={24} />}
                        <span className="text-xl font-black tracking-wide">Surprise Me!</span>
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="w-full space-y-12">
                {!hasGenerated && !loading && !error && (
                    <div className={`flex flex-col items-center justify-center py-20 opacity-20 space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-20 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="w-32 h-32 rounded-full border-4 border-dashed border-base-content flex items-center justify-center">
                            <FaQuestionCircle size={48} />
                        </div>
                        <p className="text-2xl font-black italic tracking-tight">Waiting for your command...</p>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-8 border-primary/20 border-t-primary animate-spin"></div>
                            <FaMagic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-primary animate-pulse">Consulting the Chefs...</p>
                            <p className="text-base-content/50 font-medium italic mt-2">Selecting three random masterpieces from our vault.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-xl mx-auto p-8 bg-error/10 border border-error/20 rounded-[2rem] text-error flex flex-col items-center gap-4 text-center animate-shake">
                        <FaUtensils size={40} className="opacity-50" />
                        <p className="text-xl font-bold">{error}</p>
                        <button onClick={handleGeneration} className="btn btn-error btn-outline rounded-xl px-8">Try Again</button>
                    </div>
                )}

                {recipes.length > 0 && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        {recipes.map((recipe, idx) => (
                            <RecipeCard 
                                key={`${recipe.name}-${idx}`} 
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

            {hasGenerated && !loading && (
                <div className="text-center pt-8 opacity-50 hover:opacity-100 transition-opacity">
                    <p className="text-sm font-bold uppercase tracking-widest text-base-content/40">Not satisfied?</p>
                    <button onClick={handleGeneration} className="btn btn-ghost btn-sm rounded-xl mt-2 text-primary">Roll Again</button>
                </div>
            )}

            <FoodIconsBar />
        </div>
    )
}
