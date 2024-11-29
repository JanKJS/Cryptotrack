import React from 'react';

export default function GasTrackerPage() {
  const gasData = {
    slow: {
      gwei: 8.16,
      time: '~135 secs'
    },
    standard: {
      gwei: 8.23,
      time: '~126 secs'
    },
    fast: {
      gwei: 9.12,
      time: '~45 secs'
    }
  };

  return (
    <div className="bg-background-light rounded-lg border border-background-lighter p-6">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Ethereum Gas Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(gasData).map(([speed, data]) => (
          <div key={speed} className="card">
            <h2 className="text-lg font-bold text-text-primary capitalize mb-2">{speed}</h2>
            <div className="text-2xl font-bold text-primary mb-1">
              {data.gwei} Gwei
            </div>
            <div className="text-sm text-text-secondary">
              {data.time}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-text-tertiary text-right">
        Powered by Etherscan
      </div>
    </div>
  );
}