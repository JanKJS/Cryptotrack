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
} from 'recharts';
import { getCoinPriceHistory } from '../api/crypto';

interface PriceChartProps {
  coinId: string;
}

export default function PriceChart({ coinId }: PriceChartProps) {
  const { data: priceHistory, isLoading } = useQuery(
    ['coinPriceHistory', coinId],
    () => getCoinPriceHistory(coinId)
  );

  if (isLoading) return <div>Loading chart...</div>;
  if (!priceHistory) return null;

  const data = priceHistory.prices.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price,
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}