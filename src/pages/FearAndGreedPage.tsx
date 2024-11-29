import React from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { getGlobalMarketData } from '../api/crypto';

export default function FearAndGreedPage() {
  const { data: globalData, isLoading } = useQuery('globalMarketData', getGlobalMarketData);

  if (isLoading) return <div>Loading chart data...</div>;

  // This is a mock data generator for the Fear & Greed Index
  const generateMockData = () => {
    const data = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate a somewhat realistic value based on market cap changes
      const baseValue = 50;
      const volatility = (globalData?.market_cap_change_percentage_24h_usd || 0) / 2;
      const randomFactor = Math.sin(i) * 20;
      const value = Math.max(0, Math.min(100, baseValue + volatility + randomFactor));
      
      data.push({
        date,
        value: Math.round(value)
      });
    }
    return data;
  };

  const data = generateMockData();
  const currentValue = data[data.length - 1].value;

  const getIndexCategory = (value: number) => {
    if (value >= 75) return 'Extreme Greed';
    if (value >= 55) return 'Greed';
    if (value >= 45) return 'Neutral';
    if (value >= 25) return 'Fear';
    return 'Extreme Fear';
  };

  const getColorForValue = (value: number) => {
    if (value >= 75) return '#22c55e';
    if (value >= 55) return '#84cc16';
    if (value >= 45) return '#eab308';
    if (value >= 25) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-6">Crypto Fear & Greed Index</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Current Index</p>
          <p className="text-2xl font-bold" style={{ color: getColorForValue(currentValue) }}>
            {currentValue}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Category</p>
          <p className="text-2xl font-bold" style={{ color: getColorForValue(currentValue) }}>
            {getIndexCategory(currentValue)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Last Updated</p>
          <p className="text-2xl font-bold">
            {format(new Date(), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(date, 'MMM d')}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={(date) => format(date, 'MMM d, yyyy')}
              formatter={(value: number) => [value, 'Index Value']}
            />
            <ReferenceLine y={75} stroke="#22c55e" strokeDasharray="3 3" />
            <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { range: '0-25', label: 'Extreme Fear', color: '#ef4444' },
          { range: '26-45', label: 'Fear', color: '#f97316' },
          { range: '46-55', label: 'Neutral', color: '#eab308' },
          { range: '56-75', label: 'Greed', color: '#84cc16' },
          { range: '76-100', label: 'Extreme Greed', color: '#22c55e' }
        ].map((category) => (
          <div
            key={category.range}
            className="p-3 rounded-lg text-center"
            style={{ backgroundColor: category.color + '20', color: category.color }}
          >
            <div className="font-bold">{category.label}</div>
            <div className="text-sm">{category.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}