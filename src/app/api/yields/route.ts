import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes

interface Pool {
    chain: string;
    project: string;
    symbol: string;
    tvlUsd: number;
    apy: number;
    pool: string;
    stablecoin: boolean;
}

export async function GET() {
    try {
        const response = await fetch('https://yields.llama.fi/pools');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Filter for stablecoins and valid data
        // We look for pools where 'stablecoin' is true OR symbol contains USD/DAI/USDT/USDC
        const stablecoinPools = data.data.filter((pool: Pool) => {
            const isStable = pool.stablecoin ||
                ['USD', 'DAI', 'USDT', 'USDC', 'FRAX', 'LUSD'].some(s => pool.symbol.includes(s));
            const hasTvl = pool.tvlUsd > 100000; // Filter out dust pools (<$100k)
            const hasApy = pool.apy > 0 && pool.apy < 500; // Filter out crazy APYs

            return isStable && hasTvl && hasApy;
        });

        // Sort by TVL descending
        stablecoinPools.sort((a: Pool, b: Pool) => b.tvlUsd - a.tvlUsd);

        return NextResponse.json({
            data: stablecoinPools.slice(0, 100), // Return top 100 for performance
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching yields:', error);
        return NextResponse.json({ error: 'Failed to fetch yields' }, { status: 500 });
    }
}
