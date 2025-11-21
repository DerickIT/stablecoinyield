"use client";

import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Pool {
    chain: string;
    project: string;
    symbol: string;
    tvlUsd: number;
    apy: number;
}

interface YieldTableProps {
    data: Pool[];
    isLoading: boolean;
}

export default function YieldTable({ data, isLoading }: YieldTableProps) {
    if (isLoading) {
        return (
            <div className="w-full space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="glass-card h-20 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl glass-panel">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="p-6 font-medium">Protocol</th>
                            <th className="p-6 font-medium">Chain</th>
                            <th className="p-6 font-medium">Asset</th>
                            <th className="p-6 font-medium text-right">TVL</th>
                            <th className="p-6 font-medium text-right">APY</th>
                            <th className="p-6 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((pool, index) => (
                            <motion.tr
                                key={`${pool.project}-${pool.chain}-${pool.symbol}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/5 transition-colors"
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                                            {pool.project.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-white text-lg">{pool.project}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-400 border border-white/10">
                                        {pool.chain}
                                    </span>
                                </td>
                                <td className="p-6 font-medium text-gray-400">
                                    {pool.symbol}
                                </td>
                                <td className="p-6 text-right font-mono text-gray-300">
                                    ${(pool.tvlUsd / 1000000).toFixed(2)}M
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp size={16} className="text-primary" />
                                        <span className="text-xl font-bold text-gradient font-mono">
                                            {pool.apy.toFixed(2)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2 rounded-full hover:bg-primary/20 text-primary transition-all hover:scale-110">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
