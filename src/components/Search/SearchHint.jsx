import { useEffect, useState } from 'react';

export default function SearchHint({ searchType }) {
    const [isVisible, setIsVisible] = useState(false)

    const hints = {
        ingredient: "E.g., 'Spinach' or 'Onion'.",
        name: "E.g., 'Lamb Pilaf' or 'Chicken Curry'.",
        area: "American, British, Canadian, Chinese, Croatian, Dutch, Egyptian, Filipino, French, Greek, Indian, Irish, Italian, Jamaican, Japanese, Kenyan, Malaysian, Mexican, Moroccan, Polish, Portuguese, Russian, Spanish, Thai, Tunisian, Turkish, Ukranian, Uruguayan, Vietnamese",
        category: "Beef, Breakfast, Chicken, Dessert, Goat, Lamb, Miscellaneous, Pasta, Porl, Seafood, Side, Starter, Vegan, Vegetarian",
        initial: "Looks like you haven't chosen a search method yet. Pick one above!"
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
        <div className={`bg-base-200 p-6 rounded-xl shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-10'}`}>
            {((searchType === "area") || (searchType === "category")) && (
                <h1 className="font-medium">Possible search terms (only enter 1 word):</h1>
            )}
            <h1>
                {searchType === "name" && (
                    <span className="font-medium">Only enter 1-2 words. {" "}</span>
                )}
                {searchType ==="ingredient" && (
                    <span className="font-medium">Only enter 1 word. {" "}</span>
                )}
                {hints[searchType]}
            </h1>
        </div>
    )
}