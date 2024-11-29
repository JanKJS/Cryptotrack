import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getTopCoins } from '../api/crypto';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function GainersLosersPage() {
  const [showGainers, setShowGainers] = useState(true);
  const { data: coins, isLoading } = useQuery('allCoins', () => getTopCoins(1, 100));

  if (isLoading) return <div className="text-text-primary">Loading data...</div>;

  const sortedCoins = [...(coins || [])].sort((a, b) => 
    b.price_change_percentage_24h - a.price_change_percentage_24h
  );

  const gainers = sortedCoins.filter(coin => coin.price_change_percentage_24h > 0);
  const losers = sortedCoins.filter(coin => coin.price_change_percentage_24h < 0);

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Biggest Gainers and Losers (24h)</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowGainers(true)}
          className={`btn ${
            showGainers 
              ? 'bg-primary text-white' 
              : 'bg-background-lighter text-text-primary'
          }`}
        >
          Top Gainers
        </button>
        <button
          onClick={() => setShowGainers(false)}
          className={`btn ${
            !showGainers 
              ? 'bg-primary text-white' 
              : 'bg-background-lighter text-text-primary'
          }`}
        >
          Top Losers
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(showGainers ? gainers : losers).slice(0, 12).map(coin => (
          <div key={coin.id} className="card">
            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.name} className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-text-primary">{coin.name}</h3>
                <p className="text-sm text-text-secondary">{coin.symbol.toUpperCase()}</p>
              </div>
              <div className="ml-auto">
                <div className="text-right font-semibold text-text-primary">
                  ${coin.current_price.toLocaleString()}
                </div>
                <div className={`flex items-center justify-end text-sm ${
                  coin.price_change_percentage_24h >= 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}