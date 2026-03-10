import { HashRouter, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './Context/RecipeContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Scanner from './pages/Scanner';
import Indecisive from './pages/Indecisive';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <RecipeProvider>

    <HashRouter>
      <Navbar />
      <Routes>
        <Route exact path ="/" element={<Home />} />
        <Route path ="/search" element={<Search />} />
        <Route path ="/scanner" element={<Scanner />} />
        <Route path ="/indecisive" element={<Indecisive />} />
        <Route path ="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </HashRouter>
    </RecipeProvider>
  );
}

export default App;
