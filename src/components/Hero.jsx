import { useEffect, useState } from 'react';
import arrow from '../assets/icons/down-arrow.png'

export default function Section1_Home() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const showTimeout = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(showTimeout);
    }, [])

    return(
        <section id="section1" className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 lg:px-20 overflow-hidden pt-10">
            {/* Animated Background Blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700 -z-10"></div>

            <div className="max-w-4xl w-full text-center space-y-12 z-10">
                <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-tight">
                        <span className="block text-base-content">Eat smarter,</span>
                        <span className="gradient-text">not harder.</span>
                    </h1>
                </div>

                <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <p className="text-xl lg:text-3xl text-base-content/70 font-medium leading-relaxed max-w-3xl mx-auto">
                        Welcome to <span className="text-primary font-bold">Recipedia</span>. 
                        The smart companion for your culinary journey. Discover recipes, scan nutrition, and transform your kitchen into a center of wellness.
                    </p>
                </div>

                <div className={`transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
                        <button
                            onClick={() => {
                                document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="btn btn-primary btn-lg rounded-2xl px-12 transition-all duration-300 hover:scale-[1.02] group"
                        >
                            Get Started
                            <img className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform" src={arrow} alt="arrow" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                 onClick={() => document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' })}>
                <img className="h-6 w-6 opacity-30" src={arrow} alt="scroll down" />
            </div>
        </section>
    );
}