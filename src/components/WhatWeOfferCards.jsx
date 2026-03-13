import React from 'react';
import { Link } from 'react-router-dom';

function WhatWeOfferCards({ image, title, content, link }) {
  return (
    <div className="glass p-8 rounded-3xl text-center hover-lift flex flex-col items-center gap-4 border border-white/20 h-full justify-between group">
      <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
        <img src={image} alt={title} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-primary">{title}</h2>
        <p className="text-base-content/70 text-lg leading-relaxed font-medium">
          {content}
        </p>
      </div>

      <Link
        to={link.replace('#', '')}
        onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })}}
        className="btn btn-primary btn-md rounded-2xl w-full mt-4 hover:scale-[1.02]"
      >
        Explore Now
      </Link>
    </div>
  );
}

export default WhatWeOfferCards;
