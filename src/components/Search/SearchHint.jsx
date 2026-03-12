import { FaInfoCircle } from 'react-icons/fa';

export default function SearchHint({ searchType }) {
    const hints = {
        ingredient: "Enter a single ingredient like 'Beef' or 'Rice'.",
        name: "Try descriptive names like 'Pie' or 'Pizza'.",
        area: "Cuisines: American, British, Canadian, Chinese, French, Indian, Italian, Japanese, Mexican, etc.",
        category: "Categories: Beef, Breakfast, Chicken, Dessert, Seafood, Vegan, Vegetarian, etc.",
        initial: "Select a search method above to begin your culinary journey."
    }

    if (!searchType) return null;

    return (
        <div className="flex items-start gap-4 p-5 bg-primary/5 rounded-3xl border border-primary/10 max-w-2xl mx-auto">
            <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
                <FaInfoCircle size={18} />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-primary uppercase tracking-wider">Search Tip</p>
                <p className="text-base-content/70 font-medium">
                    {hints[searchType]}
                </p>
            </div>
        </div>
    )
}