import { useState, useEffect } from "react";
import { FaFileDownload, FaUpload, FaChartPie, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import FoodIconsBar from '../components/Shared/FoodIconsBar';

export default function Scanner() {
    // ... rest of code ...
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [nutritionData, setNutritionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false)

    const key = import.meta.env.VITE_API_NINJAS_KEY

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const validateImage = (file) => {
        const maxSize = 200000; // 200 kb
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (file.size > maxSize) throw new Error("File too large. Max 200KB allowed.");
        if (!allowedTypes.includes(file.type.toLowerCase())) throw new Error("Unsupported format. Use JPG, PNG or WebP.");
    }

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                validateImage(file);
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
                setNutritionData([]);
                setError("");
            } catch (err) {
                setError(err.message);
                setImage(null);
                setImagePreview(null);
            }
        }
    };

    const handleAnalyse = async () => {
        setLoading(true);
        setError("");
        setNutritionData([]);

        try {
            const formData = new FormData();
            formData.append("image", image);

            const ocrRes = await fetch("https://api.api-ninjas.com/v1/imagetotext", {
                method: "POST",
                headers: { "X-Api-Key": key },
                body: formData,
            });

            if (!ocrRes.ok) throw new Error("Could not read text from image. Try a clearer photo.");
            const textData = await ocrRes.json();
            const fullText = textData.map(o => o.text).join(" ").trim();

            if (!fullText) throw new Error("No text detected in the image.");

            const nutriRes = await fetch(
                "https://api.api-ninjas.com/v1/nutrition?query=" + encodeURIComponent(fullText),
                { headers: { "X-Api-Key": key } }
            );

            if (!nutriRes.ok) throw new Error("Nutrition service unavailable.");
            const data = await nutriRes.json();

            if (!data || data.length === 0) throw new Error("No nutritional info found for this text.");
            setNutritionData(data);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        const printWindow = window.open('', '_blank');
        const html = `
            <html>
                <head>
                    <title>Nutrition Analysis</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                        h1 { color: #DE6B48; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                        .item { margin-bottom: 30px; padding: 20px; background: #f9f9f9; border-radius: 12px; }
                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                        .cal { font-weight: bold; color: #DE6B48; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <h1>Nutrition Analysis Report</h1>
                    ${nutritionData.map(item => `
                        <div class="item">
                            <h3>${item.name}</h3>
                            <div class="grid">
                                <div>Fat: ${item.fat_total_g}g</div>
                                <div>Carbs: ${item.carbohydrates_total_g}g</div>
                                <div>Protein: ${item.protein_g}g</div>
                                <div>Sugar: ${item.sugar_g}g</div>
                            </div>
                            <div class="cal">Calories: ${item.calories} kcal</div>
                        </div>
                    `).join('')}
                    <script>window.onload = () => { window.print(); window.close(); }</script>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-12">
            <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
                    Smart <span className="gradient-text">Nutrition Scanner.</span>
                </h1>
                <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-medium leading-relaxed">
                    Upload an image of a menu, recipe, or food journal. 
                    Our AI will extract the text and analyze the nutritional content instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Upload */}
                <div className={`lg:col-span-5 space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="glass p-8 rounded-[2.5rem] border border-white/20 space-y-8">
                        <div className="relative group border-2 border-dashed border-base-content/10 rounded-[2rem] p-8 transition-all hover:border-primary/50 bg-base-100/50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-48 object-cover rounded-2xl" alt="preview" />
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <FaImage size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold">Drop your image here</p>
                                            <p className="text-sm text-base-content/50">JPG, PNG, WebP (Max 200KB)</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyse}
                            disabled={!image || loading}
                            className="btn btn-primary btn-lg w-full rounded-2xl transition-all duration-300 gap-3"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : <FaChartPie />}
                            {loading ? "Analyzing..." : "Get Nutrition Facts"}
                        </button>

                        <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4">
                            <FaExclamationTriangle className="text-primary mt-1 shrink-0" />
                            <p className="text-xs font-medium text-base-content/70 italic">
                                Note: For best results, ensure the text is clear and well-lit. Handwritten notes may be less accurate.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className={`lg:col-span-7 space-y-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-3xl font-black tracking-tight">Analysis Results</h2>
                        <button
                            onClick={generatePDF}
                            disabled={nutritionData.length === 0}
                            className="btn btn-outline btn-primary rounded-xl px-6 transition-all"
                        >
                            <FaFileDownload /> Export PDF
                        </button>
                    </div>

                    <div className="glass rounded-[2.5rem] p-8 border border-white/20 min-h-[400px]">
                        {error && (
                            <div className="bg-error/10 border border-error/20 p-6 rounded-2xl text-error flex gap-4 items-center animate-shake">
                                <FaExclamationTriangle size={24} />
                                <p className="font-bold">{error}</p>
                            </div>
                        )}

                        {!loading && !error && nutritionData.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4 opacity-30">
                                <FaUpload size={48} />
                                <p className="text-xl font-bold italic">Upload an image to see nutritional insights.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center h-[300px] space-y-6">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-primary animate-pulse">Processing Image</p>
                                    <p className="text-base-content/50 font-medium italic">Extracting data via API Ninjas OCR...</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {nutritionData.map((item, idx) => (
                                <div key={idx} className="bg-white/50 p-6 rounded-[2rem] border border-white/50 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-black tracking-tight text-primary capitalize">{item.name}</h3>
                                        <div className="bg-primary/10 px-3 py-1 rounded-lg text-xs font-black text-primary">
                                            {item.calories} kcal
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {[
                                            { label: 'Fat', val: item.fat_total_g, unit: 'g' },
                                            { label: 'Carbs', val: item.carbohydrates_total_g, unit: 'g' },
                                            { label: 'Protein', val: item.protein_g, unit: 'g' },
                                            { label: 'Sugar', val: item.sugar_g, unit: 'g' }
                                        ].map(stat => (
                                            <div key={stat.label} className="flex flex-col">
                                                <span className="text-[10px] uppercase font-black text-base-content/30 tracking-widest">{stat.label}</span>
                                                <span className="font-bold">{stat.val}<span className="text-[10px] ml-0.5 opacity-50">{stat.unit}</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <FoodIconsBar />
        </div>
    )
}
