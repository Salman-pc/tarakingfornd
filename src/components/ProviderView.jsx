import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

export const ProviderView = ({ tripId, provider }) => {
  const socket = useSocket();
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const startDemoTracking = () => {
    if (!socket) {
      console.error('❌ PROVIDER: Socket not connected');
      alert('Socket not connected');
      return;
    }

    console.log('🎬 PROVIDER: Starting DEMO tracking for trip:', tripId);
    socket.emit('provider:start', { tripId, provider });

    // Simulate movement from office to customer (New York area)
    let step = 0;
    const startLat = 40.7580;
    const startLng = -73.9855;
    const endLat = 40.7128;
    const endLng = -74.0060;
    const totalSteps = 20;

    const interval = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(interval);
        return;
      }

      const progress = step / totalSteps;
      const lat = startLat + (endLat - startLat) * progress;
      const lng = startLng + (endLng - startLng) * progress;

      console.log(`📍 PROVIDER: DEMO location ${step + 1}/${totalSteps} - Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      socket.emit('provider:location', { tripId, lat, lng });
      step++;
    }, 2000);

    setWatchId(interval);
    setIsTracking(true);
    setDemoMode(true);
    console.log('✅ PROVIDER: DEMO tracking started');
  };

  const startTracking = () => {
    if (!socket) {
      console.error('❌ PROVIDER: Socket not connected');
      alert('Socket not connected');
      return;
    }
    if (!navigator.geolocation) {
      console.error('❌ PROVIDER: Geolocation not supported');
      alert('Geolocation not supported');
      return;
    }

    console.log('🚗 PROVIDER: Starting tracking for trip:', tripId);
    socket.emit('provider:start', { tripId, provider });

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 PROVIDER: Sending location - Lat:', latitude, 'Lng:', longitude);
        socket.emit('provider:location', { tripId, lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('❌ PROVIDER: Geolocation error:', error.message);
        alert('Location error: ' + error.message);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(id);
    setIsTracking(true);
    console.log('✅ PROVIDER: Tracking started with watchId:', id);
  };

  const stopTracking = () => {
    if (watchId) {
      if (demoMode) {
        clearInterval(watchId);
      } else {
        navigator.geolocation.clearWatch(watchId);
      }
    }
    socket.emit('trip:end', tripId);
    setIsTracking(false);
    setDemoMode(false);
    console.log('🛑 PROVIDER: Tracking stopped');
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        if (demoMode) {
          clearInterval(watchId);
        } else {
          navigator.geolocation.clearWatch(watchId);
        }
      }
    };
  }, [watchId, demoMode]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Provider Dashboard</h1>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Trip ID</p>
            <p className="text-lg font-semibold">{tripId}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Provider</p>
            <p className="text-lg font-semibold">{provider.name}</p>
          </div>
          {!isTracking ? (
            <>
              <button
                onClick={startDemoTracking}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                🎬 Start Demo Tracking
              </button>
              <button
                onClick={startTracking}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                📍 Start Real GPS Tracking
              </button>
            </>
          ) : (
            <button
              onClick={stopTracking}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Stop Tracking
            </button>
          )}
          {isTracking && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Tracking Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
