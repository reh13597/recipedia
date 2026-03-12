import emailjs from 'emailjs-com';
import { useState } from 'react';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function EmailForm() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await emailjs.sendForm(serviceID, templateID, e.target, publicKey);
            setStatus({ type: 'success', msg: 'Message sent successfully! We\'ll get back to you soon.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ type: '', msg: '' }), 6000);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.dataset.name || e.target.name]: e.target.value });
    }

    return(
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-base-content/40 ml-4">Full Name</label>
                    <input
                        type="text"
                        name="from_name"
                        data-name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-lg w-full rounded-2xl bg-base-100 border-base-content/10 focus:border-primary focus:outline-none "
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-base-content/40 ml-4">Email Address</label>
                    <input
                        type="email"
                        name="from_email"
                        data-name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-lg w-full rounded-2xl bg-base-100 border-base-content/10 focus:border-primary focus:outline-none "
                        placeholder="john@example.com"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-base-content/40 ml-4">Subject</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input input-lg w-full rounded-2xl bg-base-100 border-base-content/10 focus:border-primary focus:outline-none "
                    placeholder="How can we help?"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-base-content/40 ml-4">Message</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea textarea-lg w-full h-48 rounded-[2rem] bg-base-100 border-base-content/10 focus:border-primary focus:outline-none  pt-4"
                    placeholder="Tell us more about your inquiry..."
                    required>
                </textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full rounded-2xl transition-all duration-300 gap-3"
            >
                {loading ? <span className="loading loading-spinner"></span> : <FaPaperPlane />}
                {loading ? "Sending..." : "Send Message"}
            </button>

            {status.msg && (
                <div className={`alert rounded-2xl border-none animate-in fade-in slide-in-from-top-4 ${
                    status.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                    {status.type === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationCircle size={20} />}
                    <span className="font-bold">{status.msg}</span>
                </div>
            )}
        </form>
    );
}

