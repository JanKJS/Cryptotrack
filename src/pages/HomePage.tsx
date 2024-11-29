import React from 'react';
import MarketOverview from '../components/MarketOverview';
import TrendingCoins from '../components/TrendingCoins';
import CoinList from '../components/CoinList';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <MarketOverview />
      <TrendingCoins />
      <CoinList />
    </div>
  );
}