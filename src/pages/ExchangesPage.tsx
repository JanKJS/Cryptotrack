import React from 'react';
import { useQuery } from 'react-query';
import { getGlobalMarketData } from '../api/crypto';

export default function ExchangesPage() {
  const { data: globalData } = useQuery('globalMarketData', getGlobalMarketData);

  // Mock exchange data
  const exchanges = [
    { name: 'Binance', volume24h: 12345678900, marketShare: 28.5, markets: 2342, coins: 387 },
    { name: 'Coinbase', volume24h: 5678901234, marketShare: 15.2, markets: 1234, coins: 256 },
    { name: 'Kraken', volume24h: 3456789012, marketShare: 9.8, markets: 987, coins: 189 },
    // Add more exchanges as needed
  ];

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Top Cryptocurrency Exchanges</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-background-lighter">
              <th className="px-6 py-3 text-left text-text-secondary">#</th>
              <th className="px-6 py-3 text-left text-text-secondary">Exchange</th>
              <th className="px-6 py-3 text-right text-text-secondary">24h Volume</th>
              <th className="px-6 py-3 text-right text-text-secondary">Market Share</th>
              <th className="px-6 py-3 text-right text-text-secondary">Markets</th>
              <th className="px-6 py-3 text-right text-text-secondary">Coins</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange, index) => (
              <tr key={exchange.name} className="border-b border-background-lighter">
                <td className="px-6 py-4 text-text-secondary">{index + 1}</td>
                <td className="px-6 py-4 text-text-primary">{exchange.name}</td>
                <td className="px-6 py-4 text-right text-text-primary">
                  ${exchange.volume24h.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-text-primary">
                  {exchange.marketShare}%
                </td>
                <td className="px-6 py-4 text-right text-text-primary">
                  {exchange.markets}
                </td>
                <td className="px-6 py-4 text-right text-text-primary">
                  {exchange.coins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}