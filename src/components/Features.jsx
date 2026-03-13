import WhatWeOfferCards from './WhatWeOfferCards'
import search from '../assets/icons/search-interface-symbol.png'
import scanner from '../assets/icons/Scanner.png'
import indecisive from '../assets/icons/indecisive.png'
import carrot from '../assets/icons/carrot.png'
import meat from '../assets/icons/meat.png'
import FoodIconsBar from './Shared/FoodIconsBar'

function Section2_Home() {
  return (
    <section id="section2" className="relative py-24 px-6 lg:px-20 min-h-screen flex flex-col items-center justify-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 opacity-10 blur-xl -z-10 rotate-12">
            <img className="h-40 w-40" src={meat} alt="meat" />
        </div>
        <div className="absolute bottom-40 left-10 opacity-10 blur-xl -z-10 -rotate-12">
            <img className="h-32 w-32" src={carrot} alt="carrot" />
        </div>

        <div className="text-center space-y-4 mb-20 max-w-2xl">
            <h2 className="text-base font-black tracking-widest text-primary uppercase">Our Features</h2>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-base-content leading-tight">
                Everything you need to <span className="text-primary underline decoration-secondary/30 decoration-8 underline-offset-8">Cook Better.</span>
            </h1>
            <p className="text-xl text-base-content/60 font-medium pt-4">
                From AI-powered nutrition scanning to a vast database of recipes, we provide the tools to make your kitchen smarter.
            </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto'>
          <WhatWeOfferCards
            image={search}
            title='Recipe Search'
            content= 'Access thousands of recipes filterable by area, category, or main ingredient!'
            link="/search"
          />
          <WhatWeOfferCards
            image={scanner}
            title='Nutrition Scanner'
            content= 'Instantly get nutrition facts from menus or food journals using advanced image recognition.'
            link="/scanner"
          />
          <WhatWeOfferCards
            image={indecisive}
            title='Feeling Indecisive?'
            content= 'Let our smart engine surprise you with a perfectly balanced meal suggestion for any time of day.'
            link="/indecisive"
          />
        </div>

        <FoodIconsBar />
    </section>
  )
}

export default Section2_Home