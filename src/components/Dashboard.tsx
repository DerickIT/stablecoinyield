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
        <div className="container mx-auto px-4 py-16 space-y-12 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold tracking-tighter text-white">
                        <span className="text-gradient">StableYield</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-light max-w-2xl">
                        Discover and track the highest stablecoin yields across the decentralized finance ecosystem.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-card px-5 py-2.5 flex items-center gap-3 text-sm text-gray-300 border-primary/20">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </div>
                        <span className="font-medium tracking-wide">LIVE SYSTEM</span>
                    </div>
                    <div className="glass-card px-5 py-2.5 text-sm text-gray-500 font-mono">
                        {lastUpdated || "Syncing..."}
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2 items-center justify-between bg-black/60">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search protocols, chains, or tokens..."
                        className="w-full bg-transparent border-none rounded-xl py-4 pl-14 pr-4 text-white placeholder-gray-600 focus:ring-0 focus:bg-white/5 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto p-2">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white font-medium">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                    <button
                        onClick={fetchData}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-primary hover:scale-105 transition-all shadow-lg shadow-white/10 hover:shadow-primary/20"
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
                <div className="flex justify-center items-center gap-6 pb-12">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 rounded-xl glass-card hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-300 font-medium hover:text-white"
                    >
                        Previous
                    </button>
                    <span className="text-gray-500 font-mono">
                        Page <span className="text-white">{currentPage}</span> of <span className="text-white">{Math.ceil(filteredData.length / itemsPerPage)}</span>
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}
                        disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                        className="px-6 py-3 rounded-xl glass-card hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-300 font-medium hover:text-white"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
