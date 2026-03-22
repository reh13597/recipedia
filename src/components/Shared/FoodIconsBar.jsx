import apple from '../../assets/icons/apple.png'
import carrot from '../../assets/icons/carrot.png'
import meat from '../../assets/icons/meat.png'
import arrow from '../../assets/icons/down-arrow.png'

export default function FoodIconsBar() {
    const icons = [
        { src: meat, alt: 'meat', delay: '0ms', rotate: '-12deg' },
        { src: carrot, alt: 'carrot', delay: '150ms', rotate: '8deg' },
        { src: apple, alt: 'apple', delay: '300ms', rotate: '-5deg' }
    ];

    return (
        <div className="flex flex-col items-center mt-32 mb-16 gap-12 relative">
            <div className="flex items-center gap-16 lg:gap-24 relative">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent -z-10"></div>

                {icons.map((icon, index) => (
                    <div
                        key={index}
                        style={{
                            animationDelay: icon.delay,
                            rotate: icon.rotate
                        }}
                        className="group relative animate-float"
                    >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 glass rounded-full flex items-center justify-center p-4 transition-all duration-700 ease-in-out hover:rotate-0 bg-white/20 border-white/40 hover:border-primary/20 cursor-pointer">

                            <img
                                src={icon.src}
                                alt={icon.alt}
                                className="hover:cursor-default w-10 h-10 lg:w-12 lg:h-12 object-contain filter drop-shadow-md group-hover:drop-shadow-lg transition-all duration-700 ease-in-out"
                            />
                        </div>
                        {/* Shadow underneath */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-1 bg-black/5 blur-sm rounded-full group-hover:w-10 group-hover:bg-black/10 transition-all duration-700 ease-in-out"></div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="drop-shadow-lg transition-all duration-300 hover:scale-[1.04] hover:cursor-pointer group flex flex-col items-center gap-2 mt-8 opacity-50 hover:opacity-100"
            >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <img className="h-5 w-5 rotate-180 base-content" src={arrow} alt="scroll up" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content group-hover:text-primary transition duration-300">Top</span>
            </button>
        </div>
    );
}
