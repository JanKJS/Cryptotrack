import React from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getMarketChartData, getGlobalMarketData } from '../api/crypto';

export default function MarketCapPage() {
  const { data: chartData, isLoading: chartLoading } = useQuery(
    'marketCapChart',
    getMarketChartData
  );
  const { data: globalData, isLoading: globalLoading } = useQuery(
    'globalMarketData',
    getGlobalMarketData
  );

  if (chartLoading || globalLoading) return <div>Loading chart data...</div>;

  const formattedData = chartData?.market_caps?.map(([timestamp, value]: [number, number]) => ({
    date: new Date(timestamp),
    value,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-6">Total Cryptocurrency Market Cap</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Current Market Cap</p>
          <p className="text-2xl font-bold">
            ${(globalData?.total_market_cap?.usd || 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">24h Change</p>
          <p className={`text-2xl font-bold ${
            (globalData?.market_cap_change_percentage_24h_usd || 0) >= 0 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            {globalData?.market_cap_change_percentage_24h_usd?.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">BTC Dominance</p>
          <p className="text-2xl font-bold">
            {globalData?.market_cap_percentage?.btc?.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(date, 'MMM d, yyyy')}
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
            />
            <Tooltip
              labelFormatter={(date) => format(date, 'MMM d, yyyy')}
              formatter={(value: number) => [
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(value),
                'Market Cap'
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}