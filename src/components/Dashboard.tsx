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
        <div className="container-custom py-12 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tight">
                        <span className="text-gradient">StableYield</span> Analytics
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg">
                        Real-time stablecoin yield opportunities across DeFi.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Activity size={16} className="text-[var(--color-primary)]" />
                        <span>Live Updates</span>
                    </div>
                    <div className="glass-card px-4 py-2 text-sm text-[var(--text-tertiary)]">
                        Last updated: {lastUpdated}
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={20} />
                    <input
                        type="text"
                        placeholder="Search protocol, chain, or token..."
                        className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--border-light)] rounded-full py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--border-light)] hover:bg-[var(--bg-card-hover)] transition-colors text-[var(--text-secondary)]">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={fetchData}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-black font-bold hover:bg-[var(--color-primary-glow)] transition-all hover:shadow-[0_0_20px_var(--color-primary-glow)]"
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
                        className="px-4 py-2 rounded-lg glass-card hover:bg-[var(--bg-card-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-[var(--text-secondary)]">
                        Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}
                        disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                        className="px-4 py-2 rounded-lg glass-card hover:bg-[var(--bg-card-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
