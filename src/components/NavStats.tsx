import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getGlobalMarketData } from '../api/crypto';

export default function NavStats() {
  const { data: globalData } = useQuery('globalMarketData', getGlobalMarketData, {
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  const stats = [
    {
      label: 'Cryptos',
      value: '2.4M+',
      to: '/coins'
    },
    {
      label: 'Exchanges',
      value: '762',
      to: '/exchanges'
    },
    {
      label: 'Market Cap',
      value: formatNumber(globalData?.total_market_cap?.usd || 0),
      change: globalData?.market_cap_change_percentage_24h_usd?.toFixed(2) + '%',
      isPositive: (globalData?.market_cap_change_percentage_24h_usd || 0) >= 0,
      to: '/market-cap'
    },
    {
      label: '24h Vol',
      value: formatNumber(globalData?.total_volume?.usd || 0),
      to: '/volume'
    }
  ];

  return (
    <div className="fixed top-14 left-0 right-0 z-50 bg-background-light border-y border-background-lighter shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 overflow-x-auto py-2 text-sm">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.to}
              className="flex items-center gap-2 whitespace-nowrap hover:text-primary transition-colors"
            >
              <span className="text-text-secondary">{stat.label}:</span>
              <span className="text-text-primary">{stat.value}</span>
              {stat.change && (
                <span className={stat.isPositive ? 'text-green-400' : 'text-red-400'}>
                  {stat.change}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}