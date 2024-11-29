import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, TrendingDown } from 'lucide-react';
import { getGlobalMarketData, getTopCoins } from '../api/crypto';

export default function MarketStats() {
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

  // Get top gainers and losers
  const sortedCoins = [...(coins || [])].sort((a, b) => 
    b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  const topGainers = sortedCoins.slice(0, 3);
  const topLosers = sortedCoins.reverse().slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Market Cap and Volume Section */}
      <div className="space-y-4">
        <Link to="/market-cap" className="stat-card h-24">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Market Cap</h2>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">
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

        <Link to="/volume" className="stat-card h-24">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Volume</h2>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">
              {formatNumber(globalData?.total_volume?.usd || 0)}
            </div>
            <div className="text-sm text-text-tertiary">
              24h Global Volume
            </div>
          </div>
        </Link>
      </div>

      {/* Gainers and Losers Section */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/gainers-losers" className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h2 className="text-lg font-bold text-text-primary">Top Gainers</h2>
          </div>
          <div className="space-y-2">
            {topGainers.map(coin => (
              <div key={coin.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">{coin.symbol.toUpperCase()}</span>
                <span className="text-sm text-green-400">
                  +{coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </Link>

        <Link to="/gainers-losers" className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h2 className="text-lg font-bold text-text-primary">Top Losers</h2>
          </div>
          <div className="space-y-2">
            {topLosers.map(coin => (
              <div key={coin.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">{coin.symbol.toUpperCase()}</span>
                <span className="text-sm text-red-400">
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </div>
  );
}