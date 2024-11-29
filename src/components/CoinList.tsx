import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Search, ArrowUpDown } from 'lucide-react';
import { getTopCoins } from '../api/crypto';
import type { Coin } from '../types/crypto';

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'total_volume' | 'market_cap';
type SortDirection = 'asc' | 'desc';

export default function CoinList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { data: coins, isLoading } = useQuery(
    ['coins', page],
    () => getTopCoins(page),
    { keepPreviousData: true }
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCoins = [...(filteredCoins || [])].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    const valueA = a[sortField];
    const valueB = b[sortField];
    return (valueA - valueB) * multiplier;
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-text-tertiary" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-primary" /> : 
      <ArrowDown className="w-4 h-4 text-primary" />;
  };

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th 
      className="px-6 py-3 text-right cursor-pointer hover:bg-background-lighter transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-end gap-1 text-text-secondary">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  if (isLoading) return <div className="text-text-primary">Loading coins...</div>;

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Cryptocurrency Prices by Market Cap</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-5 h-5" />
          <input
            type="text"
            placeholder="Search coins..."
            className="pl-10 pr-4 py-2 bg-background border border-background-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-background-lighter">
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-background-lighter transition-colors"
                onClick={() => handleSort('market_cap_rank')}
              >
                <div className="flex items-center gap-1 text-text-secondary">
                  #
                  <SortIcon field="market_cap_rank" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-text-secondary">Coin</th>
              <SortableHeader field="current_price" label="Price" />
              <SortableHeader field="price_change_percentage_24h" label="24h" />
              <SortableHeader field="total_volume" label="Volume" />
              <SortableHeader field="market_cap" label="Market Cap" />
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin: Coin) => (
              <tr key={coin.id} className="border-b border-background-lighter hover:bg-background-lighter transition-colors">
                <td className="px-6 py-4 text-text-secondary">{coin.market_cap_rank}</td>
                <td className="px-6 py-4">
                  <Link to={`/coins/${coin.id}`} className="flex items-center group">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                    <span className="font-medium text-text-primary group-hover:text-primary">{coin.name}</span>
                    <span className="text-text-secondary ml-2">{coin.symbol.toUpperCase()}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-right text-text-primary">{formatNumber(coin.current_price)}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`flex items-center justify-end ${
                    coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {coin.price_change_percentage_24h > 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-text-primary">{formatNumber(coin.total_volume)}</td>
                <td className="px-6 py-4 text-right text-text-primary">{formatNumber(coin.market_cap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}