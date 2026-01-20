import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRfp } from '../lib/api';
import { Send, Bot, Loader2 } from 'lucide-react';

export const CreateRFP: React.FC = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            const rfp = await createRfp(input);
            navigate(`/rfp/${rfp.id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create RFP. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col px-4 sm:px-6">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                    <Bot className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What do you need to procure?</h2>
                <p className="text-gray-500 max-w-lg mb-8">
                    Describe your requirements, budget, and timeline. I'll structure it into a formal RFP for you.
                </p>

                <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm text-left">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Example</h4>
                    <p className="text-gray-600 italic">
                        "I need 20 high-performance laptops for our engineering team. Budget is $50k. We need 32GB RAM and 1TB SSD. Delivery needed by next month."
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 border-t border-gray-100">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your procurement request here..."
                        className="w-full bg-gray-50 rounded-xl pl-4 pr-14 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};
