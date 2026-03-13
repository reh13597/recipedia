import { useState, useEffect } from 'react';
import useRecipe from '../../Hooks/UseRecipe.js';
import { FaFileDownload, FaTimes, FaGlobe, FaUtensils, FaChartBar, FaClock } from 'react-icons/fa';

export default function SearchResult({ name, image, area, category, recipeData }) {
  const { setSelectedRecipe, selectedRecipe } = useRecipe();
  const [showModal, setShowModal] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const key = import.meta.env.VITE_API_NINJAS_KEY;

  const nutritionFields = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "fat_total_g", label: "Total Fat", unit: "g" },
    { key: "protein_g", label: "Protein", unit: "g" },
    { key: "carbohydrates_total_g", label: "Carbs", unit: "g" },
    { key: "sugar_g", label: "Sugar", unit: "g" },
    { key: "fiber_g", label: "Fiber", unit: "g" },
    { key: "sodium_mg", label: "Sodium", unit: "mg" },
    { key: "potassium_mg", label: "Potassium", unit: "mg" },
    { key: "cholesterol_mg", label: "Cholesterol", unit: "mg" },
  ];

  useEffect(() => {
    const fetchNutrition = async () => {
      if (!showModal || !selectedRecipe?.ingredients || nutrition) return;

      setLoading(true);
      setError(null);

      const query = selectedRecipe.ingredients
        .map(ing => `${ing.measure} ${ing.name}`)
        .join('\n');

      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
          { headers: { "X-Api-Key": key } }
        );

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();

        const totals = data.reduce((acc, item) => {
          nutritionFields.forEach(f => {
            if (typeof item[f.key] === 'number') {
              acc[f.key] = (acc[f.key] || 0) + item[f.key];
            }
          });
          return acc;
        }, {});

        setNutrition(totals);
      } catch {
        setError("Nutrition data unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, [showModal, selectedRecipe, key, nutrition]);

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    const html = `
      <html>
        <head>
          <title>${name}</title>
          <style>
            body { font-family: sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
            h1 { color: #DE6B48; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .meta { color: #666; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            h2 { font-size: 1.2rem; color: #444; }
            ul { padding-left: 20px; }
            .nutri { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f9f9f9; padding: 15px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>${name}</h1>
          <div class="meta">Cuisine: ${area} | Category: ${category}</div>
          <div class="section">
            <h2>Ingredients</h2>
            <ul>${recipeData.ingredients.map(i => `<li>${i.measure} ${i.name}</li>`).join('')}</ul>
          </div>
          <div class="section">
            <h2>Instructions</h2>
            <p>${recipeData.instructions}</p>
          </div>
          ${nutrition ? `
            <div class="section">
              <h2>Nutrition (Per Recipe)</h2>
              <div class="nutri">
                ${nutritionFields.map(f => `<div><strong>${f.label}:</strong> ${nutrition[f.key]?.toFixed(1)} ${f.unit}</div>`).join('')}
              </div>
            </div>
          ` : ''}
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <>
      <div
        onClick={() => { setSelectedRecipe(recipeData); setShowModal(true); }}
        className="group relative bg-base-100 rounded-[2rem] overflow-hidden hover-lift border border-white/10"
      >
        <div className="aspect-video w-full overflow-hidden">
          <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={name} />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="badge badge-primary rounded-lg font-bold ">{category}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-4 text-base-content/60 font-medium">
            <span className="flex items-center gap-1.5"><FaGlobe className="text-primary/50" /> {area}</span>
            <span className="flex items-center gap-1.5"><FaUtensils className="text-primary/50" /> {recipeData.ingredients.length} Items</span>
          </div>
        </div>
      </div>

      {showModal && selectedRecipe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-base-300/80 backdrop-blur-2xl" onClick={() => setShowModal(false)}></div>

          <div className="relative glass bg-white/70 w-full max-w-6xl max-h-full overflow-hidden rounded-[3rem]  flex flex-col border border-white/40">

            <div className="flex items-center justify-between p-8 border-b border-white/20">
              <div className="flex items-center gap-6">
                <img src={image} className="w-16 h-16 rounded-2xl object-cover " alt={name} />
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{name}</h2>
              </div>
              <div className="flex gap-3">
                <button onClick={generatePDF} className="btn btn-primary rounded-2xl"><FaFileDownload /> PDF</button>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-circle rounded-2xl hover:bg-error/10 hover:text-error transition-all"><FaTimes size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-8">
                  <div className="glass bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                        <FaUtensils /> Ingredients
                    </h4>
                    <ul className="space-y-4">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex justify-between items-center group">
                          <span className="font-medium text-base-content/70 group-hover:text-base-content transition-colors">{ing.name}</span>
                          <span className="badge badge-ghost rounded-lg font-bold">{ing.measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass bg-accent/5 rounded-[2rem] p-8 border border-accent/10">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-accent">
                        <FaChartBar /> Nutrition
                    </h4>
                    {loading ? (
                      <div className="flex items-center gap-3 py-4">
                        <span className="loading loading-spinner text-accent"></span>
                        <p className="font-bold text-accent animate-pulse">Analyzing...</p>
                      </div>
                    ) : error ? (
                      <p className="text-error font-medium">{error}</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {nutritionFields.map(f => (
                          <div key={f.key} className="p-3 bg-white/40 rounded-2xl border border-white/40">
                            <p className="text-[10px] uppercase font-black text-base-content/40 tracking-widest">{f.label}</p>
                            <p className="text-lg font-bold">{nutrition?.[f.key]?.toFixed(0) || 0}<span className="text-xs ml-1 opacity-50">{f.unit}</span></p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                    <div className="relative aspect-video lg:aspect-[21/9] rounded-[2.5rem] overflow-hidden ">
                        <img src={image} className="w-full h-full object-cover" alt={name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                            <div className="flex gap-6 text-white font-bold">
                                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl"><FaGlobe /> {area}</span>
                                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl"><FaClock /> 30-45 Min</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full"></span>
                            Cooking Instructions
                        </h4>
                        <p className="text-xl text-base-content/70 leading-relaxed whitespace-pre-line font-medium italic pl-4 border-l-2 border-base-content/5">
                            {selectedRecipe.instructions}
                        </p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}