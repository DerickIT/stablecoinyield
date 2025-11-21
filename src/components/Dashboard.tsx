"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Activity } from 'lucide-react';
import YieldTable from './YieldTable';

interface Pool {
    chain: string;
    project: string;
    symbol: string;
    tvlUsd: number;
    apy: number;
}

export default function Dashboard() {
    const [data, setData] = useState<Pool[]>([]);
    const [filteredData, setFilteredData] = useState<Pool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/yields');
            const json = await res.json();
            setData(json.data);
            setFilteredData(json.data);
            setLastUpdated(new Date().toLocaleTimeString());
            setCurrentPage(1);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = data.filter(pool =>
            pool.project.toLowerCase().includes(lowerQuery) ||
            pool.symbol.toLowerCase().includes(lowerQuery) ||
            pool.chain.toLowerCase().includes(lowerQuery)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchQuery, data]);

    return (
        <div className="container mx-auto px-4 py-12 space-y-8 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tight text-white">
                        <span className="text-gradient">StableYield</span> Analytics
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Real-time stablecoin yield opportunities across DeFi.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-gray-300">
                        <Activity size={16} className="text-primary" />
                        <span>Live Updates</span>
                    </div>
                    <div className="glass-card px-4 py-2 text-sm text-gray-500">
                        Last updated: {lastUpdated}
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search protocol, chain, or token..."
                        className="w-full bg-black/20 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-300">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={fetchData}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-bold hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <YieldTable data={filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)} isLoading={isLoading} />

            {/* Pagination */}
            {!isLoading && filteredData.length > 0 && (
                <div className="flex justify-center items-center gap-4 pb-12">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg glass-card hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-300"
                    >
                        Previous
                    </button>
                    <span className="text-gray-400">
                        Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}
                        disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                        className="px-4 py-2 rounded-lg glass-card hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
