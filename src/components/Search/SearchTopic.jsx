import { FaSearch } from "react-icons/fa";

export default function SearchTopic({ onSearch, searchType, setSearchType, inputText, setInputText, setError, setRecipes }){
    const placeholderText = {
        ingredient: "Enter an ingredient (e.g. Chicken)...",
        name: "Enter recipe name...",
        area: "Enter cuisine (e.g. Italian)...",
        category: "Enter category (e.g. Seafood)...",
        initial: "Choose a search method above..."
    }

    const handleSearch = () => {
        if (inputText.trim() && searchType !== "initial") {
            onSearch(searchType, inputText.trim())
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSearch()
    }

    const topics = [
        { id: 'name', label: 'Name' },
        { id: 'area', label: 'Cuisine' },
        { id: 'category', label: 'Category' },
        { id: 'ingredient', label: 'Ingredient' },
    ]

    return(
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-wrap justify-center gap-3">
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => {
                            setSearchType(topic.id)
                            setInputText('')
                            setError('')
                            setRecipes([])
                        }}
                        className={`btn btn-md rounded-2xl px-8 transition-all duration-300 border-none ${
                            searchType === topic.id 
                            ? "btn-primary scale-105" 
                            : "bg-base-100 hover:bg-base-200 text-base-content/70"
                        }`}
                    >
                        {topic.label}
                    </button>
                ))}
            </div>

            <div className="relative group max-w-2xl mx-auto w-full">
                <input
                    type="text"
                    placeholder={placeholderText[searchType]}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={searchType === "initial"}
                    className="input input-lg w-full rounded-3xl pl-14 bg-base-100 border-base-content/10 focus:border-primary focus:outline-none transition-all"
                />
                <button
                    onClick={handleSearch}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/30 group-focus-within:text-primary transition-colors"
                >
                    <FaSearch size={20} />
                </button>
                <button
                    onClick={handleSearch}
                    disabled={searchType === "initial" || !inputText.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-primary btn-sm rounded-2xl px-6"
                >
                    Search
                </button>
            </div>
        </div>
    );
}