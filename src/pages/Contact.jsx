import { useEffect, useState } from 'react';
import EmailForm from '../components/EmailForm'
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import FoodIconsBar from '../components/Shared/FoodIconsBar';

export default function Contact() {
    // ... rest of code ...
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [])

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 lg:px-20 max-w-7xl mx-auto space-y-16">
            <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
                    Get in <span className="gradient-text">Touch.</span>
                </h1>
                <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-medium leading-relaxed">
                    Have a question or feedback? We'd love to hear from you.
                    Our team is here to help you on your culinary journey.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                {/* Contact Info */}
                <div className={`lg:col-span-4 space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    {/* Fixed border color here */}
                    <div className="glass p-10 rounded-[2.5rem] border border-base-content/10 h-full space-y-10">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black tracking-tight">Contact Info</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <FaEnvelope className="text-xl" />, label: 'Email', val: 'support@recipedia.com' },
                                    { icon: <FaPhoneAlt className="text-xl" />, label: 'Phone', val: '+1 (604) 123-4567' },
                                    { icon: <FaMapMarkerAlt className="text-xl" />, label: 'Location', val: 'Vancouver, BC' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        {/* Fixed icon background here */}
                                        <div className="w-14 h-14 bg-base-content/5 rounded-2xl flex items-center justify-center text-primary/60 group-hover:text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-base-content/40">{item.label}</p>
                                            <p className="text-base font-bold text-base-content/80">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fixed response time box background and border here */}
                        <div className="p-8 bg-base-content/5 rounded-3xl border border-base-content/10 space-y-4">
                            <h4 className="font-black text-primary uppercase tracking-widest text-sm">Response Time</h4>
                            <p className="text-base-content/60 font-medium leading-relaxed">
                                We usually respond within <span className="text-primary font-bold">24 hours</span> during business days.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={`lg:col-span-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    {/* Fixed border color here */}
                    <div className="glass p-10 lg:p-12 rounded-[2.5rem] border border-base-content/10 h-full">
                        <EmailForm />
                    </div>
                </div>
            </div>

            <FoodIconsBar />
        </div>
    )
}