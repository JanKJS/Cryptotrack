import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, TrendingDown } from 'lucide-react';
import { getTopCoins, getGlobalMarketData } from '../api/crypto';

export default function MarketOverview() {
  const { data: globalData } = useQuery('globalMarketData', getGlobalMarketData);
  const { data: coins } = useQuery('topCoins', () => getTopCoins(1, 100));

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get top gainer
  const topGainer = coins
    ?.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    ?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Link to="/market-cap" className="stat-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold">Market Cap</h2>
          </div>
          <div>
            <div className="stat-value">
              {formatNumber(globalData?.total_market_cap?.usd || 0)}
            </div>
            <div className={`text-sm ${
              globalData?.market_cap_change_percentage_24h_usd >= 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {globalData?.market_cap_change_percentage_24h_usd?.toFixed(2)}% (24h)
            </div>
          </div>
        </Link>

        <Link to="/volume" className="stat-card">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold">Volume</h2>
          </div>
          <div>
            <div className="stat-value">
              {formatNumber(globalData?.total_volume?.usd || 0)}
            </div>
            <div className="text-sm text-text-tertiary">
              24h Global Volume
            </div>
          </div>
        </Link>
      </div>

      <Link to="/gainers-losers" className="space-y-4">
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold">Top Gainers/Losers</h2>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <img 
                src={topGainer?.image} 
                alt={topGainer?.name} 
                className="w-6 h-6 rounded-full"
              />
              <span className="text-text-primary">{topGainer?.name}</span>
              <span className="text-green-400 ml-auto">
                +{topGainer?.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
            <div className="text-sm text-text-tertiary mt-2">
              Click to view all gainers and losers
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}