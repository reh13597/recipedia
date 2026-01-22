import { featuresLinks, aboutUsLinks } from "../constants";
import {Link} from 'react-router-dom';
import logo from '../assets/icons/recipe-book.png';

export default function Footer() {
    return(
        <footer className="bg-base-100 text-secondary-content">
            <div className=" space-y-5 py-5">
                <div className="row ">
                    <div className="grid lg:grid-cols-2 gap-3">
                        {/* logo column */}
                        <div className="flex items-center space-x-5 pl-120">
                            <Link to="/" onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })}}>
                                <img src={logo} alt="Recipedia Logo" className="w-13 h-13 transition duration-300 hover:scale-110"/>
                            </Link>
                            <Link to="/" onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' })}} className="text-4xl text-base-content transition duration-300 hover:scale-110">Recipedia</Link>
                        </div>

                        {/* Two footer links columns */}
                        <div className="grid lg:grid-cols-2 pr-80">
                            <div>
                                <h2 className="text-2xl text-base-content mb-2">Features</h2>
                                <ul className="space-y-1">
                                    {featuresLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                className="text-lg text-secondary-content hover:text-base-content underline"
                                                onClick={() => {
                                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                                }}
                                                href={link.href}
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-2xl text-base-content mb-2">About Us</h2>
                                <ul className="space-y-1">
                                    {aboutUsLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                className="text-lg text-secondary-content hover:text-base-content underline"
                                                onClick={() => {
                                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                                }}
                                                href={link.href}
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row ">
                    <p className="text-center text-secondary-content">
                        &copy; 2025 Recipedia. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}