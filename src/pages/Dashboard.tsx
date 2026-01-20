import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRfps, deleteRfp } from '../lib/api';
import type { Rfp } from '../lib/types';
import { Plus, ChevronRight, FileText, Clock, CheckCircle, Trash2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [rfps, setRfps] = useState<Rfp[]>([]);

    useEffect(() => {
        getRfps().then(setRfps).catch(console.error);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'text-blue-600 bg-blue-50';
            case 'closed': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-500">Manage your procurement requests</p>
                </div>
                <Link to="/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <Plus size={20} />
                    <span>New RFP</span>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {rfps.map(rfp => (
                    <Link key={rfp.id} to={`/rfp/${rfp.id}`} className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{rfp.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{rfp.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> Created {new Date(rfp.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle size={14} /> {rfp._count?.proposals || 0} Proposals
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(rfp.status)}`}>
                                    {rfp.status}
                                </span>
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault(); // Prevent link navigation
                                        await deleteRfp(rfp.id);
                                        setRfps(prevRfps => prevRfps.filter(r => r.id !== rfp.id)); // Optimistic or reload
                                        getRfps().then(setRfps); // Reload just in case
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete RFP"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <ChevronRight className="text-gray-300" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {rfps.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="inline-block p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No RFPs yet</h3>
                    <p className="text-gray-500 mb-6">Create your first request to get started.</p>
                    <Link to="/create" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                        Create RFP
                    </Link>
                </div>
            )}
        </div>
    );
};
