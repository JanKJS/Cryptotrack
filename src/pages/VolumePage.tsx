import React from 'react';
import { useQuery } from 'react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getGlobalMarketData } from '../api/crypto';

export default function VolumePage() {
  const { data: globalData, isLoading } = useQuery('globalMarketData', getGlobalMarketData);

  if (isLoading) return <div className="text-text-primary">Loading volume data...</div>;

  // Generate mock historical volume data
  const generateVolumeData = () => {
    const data = [];
    const baseVolume = globalData?.total_volume?.usd || 100000000000;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomFactor = 0.8 + Math.random() * 0.4;
      data.push({
        date,
        volume: baseVolume * randomFactor
      });
    }
    return data;
  };

  const volumeData = generateVolumeData();

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Trading Volume</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-text-secondary">24h Volume</p>
          <p className="text-2xl font-bold text-text-primary">
            ${(globalData?.total_volume?.usd || 0).toLocaleString()}
          </p>
        </div>
        <div className="card">
          <p className="text-text-secondary">Volume/Market Cap</p>
          <p className="text-2xl font-bold text-text-primary">
            {((globalData?.total_volume?.usd || 0) / (globalData?.total_market_cap?.usd || 1) * 100).toFixed(2)}%
          </p>
        </div>
        <div className="card">
          <p className="text-text-secondary">BTC Volume Dominance</p>
          <p className="text-2xl font-bold text-text-primary">
            {(globalData?.market_cap_percentage?.btc || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => date.toLocaleDateString()}
              stroke="#71717A"
            />
            <YAxis
              tickFormatter={(value) => 
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  maximumFractionDigits: 0
                }).format(value)
              }
              stroke="#71717A"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ color: '#FFFFFF' }}
              itemStyle={{ color: '#A1A1AA' }}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value: number) => [
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(value),
                'Volume'
              ]}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#0099FF"
              fill="#0099FF"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}