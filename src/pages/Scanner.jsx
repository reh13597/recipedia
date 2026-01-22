import { useState, useEffect } from "react";
import Horizontal from '../components/Designs/Horizontal'
import { FaFileDownload } from 'react-icons/fa';

export default function Scanner() {
    const [image, setImage] = useState(null);
    const [nutritionData, setNutritionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [APIError, setAPIError] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const key = import.meta.env.VITE_API_NINJAS_KEY

    // check if the uploaded image fits within the image-to-text endpoint constraints
    const validateImage = (file) => {
        const maxSize = 200000; // this is in bytes, equivalent to 200 kb
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file.size > maxSize) {
            throw new Error("Error: File size is too large. Please use a file smaller than 200 KB.");
        }

        if (!allowedTypes.includes(file.type.toLowerCase())) {
            throw new Error("Error: Unsupported image format. Please either use jpeg, jpg, png, or webp.");
        }
    }

    // handles events for whenever the upload image button is clicked
    const imageChange = (e) => {
        const selectedFile = e.target.files[0];

        // check if there is a file selected
        if (selectedFile) {
            try {
                // check if the image is valid and set it to the current image
                validateImage(selectedFile);
                setImage(selectedFile);
                // reset states on file upload
                setNutritionData([])
                setError('')
                setAPIError(false)
            } catch (err) {
                // catch any errors and reset states
                setError(err.message);
                setAPIError(false)
                setImage(null);
                setNutritionData([]);
                e.target.value = '';
            }
        } else {
            // if there's no file selected, reset the states just in case
            setError('');
            setAPIError(false)
            setImage(null);
            setNutritionData([]);
            e.target.value = '';
        }
    };

    const handleAnalyse = async () => {
        setLoading(true);
        setError('');
        setAPIError(false)
        setNutritionData([]);

        try {
            validateImage(image);

            const formData = new FormData();
            formData.append("image", image);

            // image to text
            const imageToText = await fetch("https://api.api-ninjas.com/v1/imagetotext", {
                method: "POST",
                headers: {
                    "X-Api-Key": key,
                },
                body: formData,
            });

            if (!imageToText.ok) {
                const errorText = await imageToText.text();
                // console.error("Image to text error:", imageToText.status, errorText);
                throw new Error("Error: Couldn't analyze text. Try an image with clearer text.");
            }

            const textData = await imageToText.json();
            const fullText = textData.map((obj) => obj.text).join(" ").trim();

            if (!fullText) {
                throw new Error("Error: No text detected in the image. Try an image with clearer text.");
            }

            //text to nutrition
            const nutrition = await fetch(
                "https://api.api-ninjas.com/v1/nutrition?query=" + encodeURIComponent(fullText),
                {
                    method: "GET",
                    headers: {
                        "X-Api-Key": key,
                    },
                }

            );

            if (!nutrition.ok) {
                const errorText = await nutrition.text();
                // console.error("Text to nutrition error:", nutrition.status, errorText);
                setAPIError(true)
                throw new Error();
            }

            const data = await nutrition.json();

            if (!data || data.length === 0) {
                throw new Error("Error: No nutritional information found. Try another image with clearer text.")
            }

            setNutritionData(data);
        } catch (err) {
            // console.error("Nutritional Analysis Error:", err);

            if (!err.message || (err.message === "Failed to fetch")) {
                setError("Error: An unexpected error occurred. Please try again.")
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // starts a timer, then after 300 ms, the state of isVisible changes
        // this is used for the animation of components on page load
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        // if the component unmounts or re-renders before the timeout finishes,
        // the timer is cleared to prevent memory leaks and warnings
        return () => {
            clearTimeout(showTimeout);
        }
    })

    // function for generating a PDF by using HTML code for PDF formatting
    // opens a new tab with the HTML code and prompts the user to print the page to PDF
    // simply printing the page to PDF would result in a very messily and poorly formmated recipe, hence the HTML formatting strategy
    const generatePDF = () => {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                <title>Nutrition Analysis</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                        page-break-after: avoid;
                    }
                    .item-title {
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .section {
                        margin-bottom: 30px;
                        page-break-inside: avoid;
                    }
                    .section-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        color: #2c3e50;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                    }
                    .section-divider {
                        border: none;
                        height: 2px;
                        margin: 20px 0;
                        background-color: black;
                    }
                    .nutrition-list {
                        list-style-type: none;
                        padding-left: 0;
                    }
                    .nutrition-list li {
                        margin-bottom: 5px;
                        padding: 5px;
                        background-color: #f8f9fa;
                        border-radius: 3px;
                    }
                    .calories {
                        font-size: 18px;
                        font-weight: bold;
                        background-color: #e9a48dff;
                        padding: 10px;
                        border-radius: 5px;
                        text-align: left;
                        margin-top: 15px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
                </head>
                <body>
                <div class="header">
                    <div class="item-title">Nutrition Analysis</div>
                </div>
                <div class="section">
                    <ul class="nutrition-list">
                        ${nutritionData.map((item) => `
                            <h2>${item.name}</h2>
                            <ul class="nutrition-list">
                                <li><strong>Fat:</strong> ${item.fat_total_g} g</li>
                                <li><strong>Saturated Fat:</strong> ${item.fat_saturated_g} g</li>
                                <li><strong>Sodium:</strong> ${item.sodium_mg} mg</li>
                                <li><strong>Potassium:</strong> ${item.potassium_mg} mg</li>
                                <li><strong>Cholesterol:</strong> ${item.cholesterol_mg} mg</li>
                                <li><strong>Carbs:</strong> ${item.carbohydrates_total_g} g</li>
                                <li><strong>Fibre:</strong> ${item.fiber_g} g</li>
                                <li><strong>Sugar:</strong> ${item.sugar_g} g</li>
                            </ul>
                            <div class="calories">
                                Estimated Calories: ${
                                    (
                                        (item.fat_total_g || 0) * 9 +
                                        (Math.max((item.carbohydrates_total_g || 0) - (item.fiber_g || 0), 0)) * 4 +
                                        (item.fiber_g || 0) * 2
                                    ).toFixed(0)
                                } kcal
                            </div>
                            <hr class="section-divider">
                        `).join('')}

                    </ul>
                </div>

                <script>
                    window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                    };
                </script>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className={`w-[35%] text-left text-3xl flex flex-col transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                <p className="pb-3">Want to find out the nutrition facts of a menu, recipe, or food journal?</p>
                <p className="py-3">Just upload a picture of it and watch the magic happen!</p>
                <div className="py-10">
                    <p className="text-sm text-secondary-content">Max file size: 200 KB</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={imageChange}
                        className="mt-2 file-input file-input-primary w-[80%] rounded-full shadow-xl flex justify-center items-center"
                    />
                    <button
                        className="btn btn-primary mt-6 w-[80%] rounded-full shadow-xl text-lg transition-all duration-300 hover:scale-105"
                        onClick={handleAnalyse}
                        disabled={!image}
                        >
                        Get Nutrition!
                    </button>
                </div>
                <Horizontal />
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <div className={`bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex flex-row justify-between">
                        <h1 className={`text-3xl mb-2 transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>Nutrition Analysis</h1>
                        <button
                            onClick={generatePDF}
                            className={`btn btn-primary text-white px-6 py-2.5 rounded-full flex items-center duration-300 hover:scale-110 shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}
                            disabled={nutritionData.length === 0}
                        >
                            <FaFileDownload /> Save as PDF
                        </button>
                    </div>
                    {(nutritionData.length === 0) && !error && !image && (
                        <div className={`bg-base-200 p-6 rounded-xl shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-10'}`}>
                            <h1>Looks like you haven't uploaded an image yet. Upload one on the left!</h1>
                        </div>
                    )}
                    {(nutritionData.length === 0) && !error && image && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1>Looks like you haven't clicked the button yet. Click it on the left!</h1>
                        </div>
                    )}
                    {error && !APIError && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1 className="font-medium text-error">{error}</h1>
                        </div>
                    )}
                    {APIError && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <p className="text-error font-medium">
                                Error: API Ninja's text to nutrition endpoint may be down. Check the status at{" "}
                                <a href="https://api-ninjas.com/api/nutrition" target="_blank" className="text-error underline">https://api-ninjas.com/api/nutrition.</a>
                            </p>
                        </div>
                    )}
                    <div className={`bg-base-200 p-6 rounded-xl shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-10'}`}>
                        <h1><span className="font-medium">Note: {" "}</span>Images with unclear text or no text will likely cause an error.</h1>
                    </div>
                    {loading && (
                        <div className="flex flex-row space-x-5">
                            <p className="text-2xl">Analyzing nutritional info, hang tight!</p>
                            <span className="loading loading-spinner text-primary loading-xl"></span>
                        </div>
                    )}
                    {nutritionData && nutritionData.length > 0 && (
                        <div className="mt-6">
                        <ul className="space-y-2">
                            {nutritionData.map((item, idx) => (
                            <li key={idx} className="p-4 bg-base-200 rounded-xl text-secondary-content">
                                <p className="font-medium text-black text-lg">{item.name}</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li><span className="font-medium">Fat:</span> {item.fat_total_g} g</li>
                                    <li><span className="font-medium">Saturated Fat:</span> {item.fat_saturated_g} g</li>
                                    <li><span className="font-medium">Sodium:</span> {item.sodium_mg} mg</li>
                                    <li><span className="font-medium">Potassium:</span> {item.potassium_mg} mg</li>
                                    <li><span className="font-medium">Cholesterol:</span> {item.cholesterol_mg} mg</li>
                                    <li><span className="font-medium">Carbs:</span> {item.carbohydrates_total_g} g</li>
                                    <li><span className="font-medium">Fibre:</span> {item.fiber_g} g</li>
                                    <li><span className="font-medium">Sugar:</span> {item.sugar_g} g</li>
                                </ul>
                                <div className="mt-2">
                                    <span className="font-medium">Estimated Calories: </span> {
                                        (
                                            (item.fat_total_g || 0) * 9 +
                                            (Math.max((item.carbohydrates_total_g || 0) - (item.fiber_g || 0), 0)) * 4 +
                                            (item.fiber_g || 0) * 2
                                            ).toFixed(0)
                                        } kcal
                                </div>
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
