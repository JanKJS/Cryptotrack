import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { getTrendingCoins } from '../api/crypto';

export default function TrendingCoins() {
  const { data: trendingCoins, isLoading } = useQuery('trending', getTrendingCoins);

  if (isLoading) return <div className="text-text-primary">Loading trending coins...</div>;

  // Limit to 9 coins
  const displayedCoins = trendingCoins?.slice(0, 9);

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Trending</h2>
        </div>
        <Link to="/trending" className="text-primary hover:text-primary-light">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedCoins?.map((coin) => (
          <Link
            key={coin.item.id}
            to={`/coins/${coin.item.id}`}
            className="card flex items-center p-4 transition-all duration-200"
          >
            <img
              src={coin.item.thumb}
              alt={coin.item.name}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-primary">
                {coin.item.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {coin.item.symbol.toUpperCase()} • Rank #{coin.item.market_cap_rank}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}