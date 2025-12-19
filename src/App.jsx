import { useState } from 'react';
import { CustomerView } from './components/CustomerView';
import { ProviderView } from './components/ProviderView';

function App() {
  const [mode, setMode] = useState('customer');
  const [tripId] = useState('TRIP-DEMO-123');

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Live Tracker</h1>
            <p className="text-xs text-gray-500">Trip ID: {tripId}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setMode('customer')}
              className={`px-4 py-2 rounded-lg font-medium transition ${mode === 'customer' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Customer
            </button>
            <button
              onClick={() => setMode('provider')}
              className={`px-4 py-2 rounded-lg font-medium transition ${mode === 'provider' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Provider
            </button>
          </div>
        </div>
      </div>

      {mode === 'customer' ? (
        <CustomerView tripId={tripId} />
      ) : (
        <ProviderView 
          tripId={tripId} 
          provider={{ name: 'John Doe', vehicle: 'Toyota Camry - ABC123' }} 
        />
      )}
    </div>
  );
}

export default App;
