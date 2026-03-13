import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/icons/recipe-book.png';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/scanner', label: 'Scanner' },
    { path: '/indecisive', label: 'Indecisive' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="sticky top-0 z-50 px-4 py-2">
      <div className="navbar glass rounded-box px-4 lg:px-8 bg-white/40 backdrop-blur-md border border-white/20 transition-all duration-300">
        <div className="navbar-start">
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group">
            <img src={logo} alt="logo" className="h-8 w-8 transition-transform duration-500 group-hover:rotate-12" />
            <span className="text-xl lg:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Recipedia</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 hover:text-primary hover:bg-primary/10 ${
                    location.pathname === link.path ? 'text-primary font-bold bg-primary/10' : 'text-base-content/70'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end flex items-center gap-4">
          <ThemeToggle />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 bg-base-100 rounded-box w-52 text-base-content border border-base-200">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={location.pathname === link.path ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-primary/10 transition-colors'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
