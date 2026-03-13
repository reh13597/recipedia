import { Link } from 'react-router-dom';
import logo from '../assets/icons/recipe-book.png';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full h-px bg-base-content/10 mb-10"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group">
            <img src={logo} alt="Recipedia Logo" className="w-10 h-10 transition-transform duration-500 group-hover:rotate-12" />
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Recipedia</span>
          </Link>

          <p className="text-base-content/40 font-medium order-3 md:order-2">
            Copyright © {new Date().getFullYear()} - All rights reserved
          </p>

          <div className="flex gap-4 order-2 md:order-3">
            <a
              href="https://github.com/reh13597/recipedia"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle hover:text-primary transition-all duration-300 hover:bg-primary/10"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
