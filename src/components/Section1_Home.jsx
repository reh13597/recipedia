import { useEffect, useState } from 'react';
import VerticalDesign1 from './Designs/Vertical1'
import VerticalDesign2 from './Designs/Vertical2'
import arrow from '../assets/icons/down-arrow.png'

export default function Section1_Home() {
    const [isVisible, setIsVisible] = useState(false)

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
        <section id="section1" className="grid grid-cols-5 px-15 min-w-svh min-h-screen">
            <div className="flex mb-20">
                <VerticalDesign1 />
            </div>
            <div className="flex flex-col col-span-3 mt-40 text-center">
                <div className={`transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-7xl text-white">Eat smarter, not harder.</h1>
                    <p className="mt-10 text-3xl text-secondary-content text-balance">Welcome to Recipedia, the recipe and nutrition platform that makes healthy eating easy. Whether you're a busy professional, fitness coach, or just someone looking to make better nutrition choices, Recipedia makes it possible to create delicious, home cooked meals that fit your dietary preferences.</p>
                    <p className="text-3xl text-secondary-content">Scroll down on this page to see what we have to offer!</p>
                </div>
                <div className={`transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
                    <button
                        onClick={() => {
                            document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="tooltip mt-20 w-fit self-center btn btn-primary rounded-full shadow-xl duration-300 hover:scale-110 transition"
                        data-tip="Scroll down the page!"
                        >
                        <img className="h-8 w-8" src={arrow} alt="Black icon of a downwards pointing greater than symbol." />
                    </button>
                </div>
            </div>
            <div className="flex justify-end mb-20">
                <VerticalDesign2 />
            </div>
        </section>
    );
}