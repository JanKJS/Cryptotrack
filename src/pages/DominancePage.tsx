import React from 'react';
import { useQuery } from 'react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getGlobalMarketData } from '../api/crypto';

export default function DominancePage() {
  const { data: globalData } = useQuery('globalMarketData', getGlobalMarketData);

  // Generate mock historical dominance data
  const generateDominanceData = () => {
    const data = [];
    const btcBase = globalData?.market_cap_percentage?.btc || 50;
    const ethBase = globalData?.market_cap_percentage?.eth || 20;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const btcRandom = (Math.random() - 0.5) * 5;
      const ethRandom = (Math.random() - 0.5) * 3;
      
      data.push({
        date,
        BTC: btcBase + btcRandom,
        ETH: ethBase + ethRandom,
        Others: 100 - (btcBase + btcRandom) - (ethBase + ethRandom)
      });
    }
    return data;
  };

  const dominanceData = generateDominanceData();

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Market Dominance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-text-secondary">BTC Dominance</p>
          <p className="text-2xl font-bold text-text-primary">
            {globalData?.market_cap_percentage?.btc?.toFixed(1)}%
          </p>
        </div>
        <div className="card">
          <p className="text-text-secondary">ETH Dominance</p>
          <p className="text-2xl font-bold text-text-primary">
            {globalData?.market_cap_percentage?.eth?.toFixed(1)}%
          </p>
        </div>
        <div className="card">
          <p className="text-text-secondary">Others</p>
          <p className="text-2xl font-bold text-text-primary">
            {(100 - (globalData?.market_cap_percentage?.btc || 0) - (globalData?.market_cap_percentage?.eth || 0)).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dominanceData} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => date.toLocaleDateString()}
            />
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Tooltip
              formatter={(value) => [`${value.toFixed(2)}%`]}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="BTC"
              stackId="1"
              stroke="#f7931a"
              fill="#f7931a"
              fillOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="ETH"
              stackId="1"
              stroke="#627eea"
              fill="#627eea"
              fillOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="Others"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}