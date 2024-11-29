import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowUp, ArrowDown, Globe, Twitter, Link as LinkIcon } from 'lucide-react';
import { getCoinDetails } from '../api/crypto';
import PriceChart from '../components/PriceChart';

export default function CoinPage() {
  const { coinId } = useParams();
  const { data: coin, isLoading } = useQuery(['coin', coinId], () => getCoinDetails(coinId!));

  if (isLoading) return <div>Loading coin details...</div>;
  if (!coin) return <div>Coin not found</div>;

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPriceUp = priceChange > 0;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <p className="text-gray-500">{coin.symbol.toUpperCase()}</p>
          </div>
          <div className="ml-auto">
            <div className="text-3xl font-bold">
              ${coin.market_data.current_price.usd.toLocaleString()}
            </div>
            <div className={`flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              {isPriceUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(priceChange).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Market Cap</p>
            <p className="text-xl font-bold">
              ${coin.market_data.market_cap.usd.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">24h Trading Volume</p>
            <p className="text-xl font-bold">
              ${coin.market_data.total_volume.usd.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Circulating Supply</p>
            <p className="text-xl font-bold">
              {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Price Chart</h2>
          <PriceChart coinId={coinId!} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About {coin.name}</h2>
          <div className="prose max-w-none" 
               dangerouslySetInnerHTML={{ __html: coin.description.en }} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            {coin.links.homepage[0] && (
              <a
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Globe className="w-5 h-5" />
                Website
              </a>
            )}
            {coin.links.twitter_screen_name && (
              <a
                href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </a>
            )}
            {coin.links.blockchain_site[0] && (
              <a
                href={coin.links.blockchain_site[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <LinkIcon className="w-5 h-5" />
                Explorer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}