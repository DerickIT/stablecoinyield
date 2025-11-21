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
        <div className="w-full overflow-hidden rounded-2xl glass-panel border-white/5 bg-black/40">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-widest font-medium">
                            <th className="p-8 font-medium">Protocol</th>
                            <th className="p-8 font-medium">Chain</th>
                            <th className="p-8 font-medium">Asset</th>
                            <th className="p-8 font-medium text-right">TVL</th>
                            <th className="p-8 font-medium text-right">APY</th>
                            <th className="p-8 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((pool, index) => (
                            <motion.tr
                                key={`${pool.project}-${pool.chain}-${pool.symbol}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/5 transition-all duration-300"
                            >
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all">
                                            {pool.project.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-white text-lg tracking-tight">{pool.project}</span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 text-sm text-gray-400 border border-white/5 group-hover:border-white/10 transition-colors font-medium">
                                        {pool.chain}
                                    </span>
                                </td>
                                <td className="p-8 font-medium text-gray-300 text-lg">
                                    {pool.symbol}
                                </td>
                                <td className="p-8 text-right font-mono text-gray-300 text-lg tracking-tight">
                                    ${(pool.tvlUsd / 1000000).toFixed(2)}M
                                </td>
                                <td className="p-8 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp size={18} className="text-primary" />
                                        <span className="text-2xl font-bold text-gradient font-mono tracking-tighter">
                                            {pool.apy.toFixed(2)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="p-8 text-right">
                                    <button className="p-3 rounded-xl bg-white/5 hover:bg-primary text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group/btn">
                                        <ArrowUpRight size={20} className="group-hover/btn:rotate-45 transition-transform duration-300" />
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
