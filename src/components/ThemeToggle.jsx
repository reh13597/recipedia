import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Recipedia');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'Recipedia' ? 'RecipediaDark' : 'Recipedia');
    };

    return (
        <div 
            onClick={toggleTheme}
            className="relative w-16 h-8 flex items-center bg-base-300 rounded-full p-1 cursor-pointer transition-colors duration-500 border border-white/10"
        >
            <div className={`absolute w-6 h-6 rounded-full transform transition-transform duration-500 flex items-center justify-center ${
                theme === 'Recipedia' 
                ? 'translate-x-0 bg-white text-orange-400' 
                : 'translate-x-8 bg-neutral text-blue-300'
            }`}>
                {theme === 'Recipedia' ? <FaSun size={14} /> : <FaMoon size={14} />}
            </div>
            <div className="flex justify-between w-full px-2 opacity-20">
                <FaSun size={12} className={theme === 'Recipedia' ? 'invisible' : ''} />
                <FaMoon size={12} className={theme === 'RecipediaDark' ? 'invisible' : ''} />
            </div>
        </div>
    );
}
