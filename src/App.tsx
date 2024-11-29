import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavStats from './components/NavStats';
import HomePage from './pages/HomePage';
import CoinPage from './pages/CoinPage';
import MarketCapPage from './pages/MarketCapPage';
import FearAndGreedPage from './pages/FearAndGreedPage';
import GainersLosersPage from './pages/GainersLosersPage';
import VolumePage from './pages/VolumePage';
import ExchangesPage from './pages/ExchangesPage';
import DominancePage from './pages/DominancePage';
import GasTrackerPage from './pages/GasTrackerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      cacheTime: 3600000,
      onError: (error) => {
        console.error('Query error:', error);
      }
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <nav className="bg-background-light border-b border-background-lighter">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                <Link to="/" className="flex items-center">
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="ml-2 text-lg font-bold text-text-primary">CryptoWatcher</span>
                </Link>
              </div>
            </div>
          </nav>

          <NavStats />

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-24">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/coins/:coinId" element={<CoinPage />} />
              <Route path="/market-cap" element={<MarketCapPage />} />
              <Route path="/fear-and-greed" element={<FearAndGreedPage />} />
              <Route path="/gainers-losers" element={<GainersLosersPage />} />
              <Route path="/volume" element={<VolumePage />} />
              <Route path="/exchanges" element={<ExchangesPage />} />
              <Route path="/dominance" element={<DominancePage />} />
              <Route path="/gas" element={<GasTrackerPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}