import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getRfps, getVendors } from './api';
import type { Rfp, Vendor } from './types';

interface DataContextType {
    rfps: Rfp[];
    vendors: Vendor[];
    refreshRfps: () => Promise<void>;
    refreshVendors: () => Promise<void>;
    isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rfps, setRfps] = useState<Rfp[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshRfps = async () => {
        try {
            const data = await getRfps();
            setRfps(data);
        } catch (error) {
            console.error('Failed to load RFPs:', error);
        }
    };

    const refreshVendors = async () => {
        try {
            const data = await getVendors();
            setVendors(data);
        } catch (error) {
            console.error('Failed to load vendors:', error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([refreshRfps(), refreshVendors()]);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    return (
        <DataContext.Provider value={{ rfps, vendors, refreshRfps, refreshVendors, isLoading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};
