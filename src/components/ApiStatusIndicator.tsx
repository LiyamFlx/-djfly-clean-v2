/**
 * API Status Indicator Component
 * Shows the connection status of all integrated services
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceStatus, testConnections } from '@/config/apiConfig';

interface ServiceStatus {
  spotify: boolean;
  supabase: boolean;
  openai: boolean;
}

const ApiStatusIndicator: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus>({
    spotify: false,
    supabase: false,
    openai: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const updateServiceStatus = () => {
    setServices({
      spotify: serviceStatus.getServiceStatus('spotify'),
      supabase: serviceStatus.getServiceStatus('supabase'),
      openai: serviceStatus.getServiceStatus('openai'),
    });
  };

  const testAllConnections = useCallback(async () => {
    setIsTesting(true);
    try {
      // Test connections but don't throw errors for demo mode
      await testConnections.all();
      updateServiceStatus();
    } catch (error) {
      console.info('Connection test completed with some services unavailable (demo mode)');
      updateServiceStatus(); // Still update the status even if some tests fail
    } finally {
      setIsTesting(false);
    }
  }, []);

  useEffect(() => {
    // Initial status check
    updateServiceStatus();

    // Skip automatic connection testing to avoid console errors in demo mode
    // testAllConnections();

    // Set up periodic checks
    const interval = setInterval(updateServiceStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [testAllConnections]);

  const getOverallStatus = () => {
    const connectedServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;

    if (connectedServices === totalServices) return 'all';
    if (connectedServices > 0) return 'partial';
    return 'demo'; // Change from 'none' to 'demo' for better UX
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'all':
        return 'text-green-400';
      case 'partial':
        return 'text-yellow-400';
      case 'demo':
        return 'text-blue-400'; // Use blue for demo mode instead of red
      default:
        return 'text-red-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'all':
        return '🟢';
      case 'partial':
        return '🟡';
      case 'demo':
        return '🔵'; // Use blue circle for demo mode
      default:
        return '🔴';
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        className="bg-gray-800 rounded-lg shadow-lg border border-gray-700"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Status Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors hover:bg-gray-700 ${getStatusColor(overallStatus)}`}
        >
          <span className="text-sm font-medium">
            {getStatusIcon(overallStatus)} API Status
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </button>

        {/* Expanded Status Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-700 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Service Status List */}
                <div className="space-y-2">
                  <ServiceStatusRow
                    name="Spotify"
                    status={services.spotify}
                    description="Music data & tracks"
                  />
                  <ServiceStatusRow
                    name="Supabase"
                    status={services.supabase}
                    description="Database & storage"
                  />
                  <ServiceStatusRow
                    name="OpenAI"
                    status={services.openai}
                    description="AI recommendations"
                  />
                </div>

                {/* Test Button */}
                <button
                  onClick={testAllConnections}
                  disabled={isTesting}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors flex items-center justify-center space-x-2"
                >
                  {isTesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      <span>Test Connections</span>
                    </>
                  )}
                </button>

                {/* Summary */}
                <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-700">
                  {Object.values(services).filter(Boolean).length} of{' '}
                  {Object.keys(services).length} services connected
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const ServiceStatusRow: React.FC<{
  name: string;
  status: boolean;
  description: string;
}> = ({ name, status, description }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <span
          className={`text-sm font-medium ${status ? 'text-white' : 'text-gray-400'}`}
        >
          {name}
        </span>
        <span className="text-xs">{status ? '✅' : '❌'}</span>
      </div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
    <div
      className={`px-2 py-1 rounded text-xs font-medium ${
        status ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
      }`}
    >
      {status ? 'Connected' : 'Offline'}
    </div>
  </div>
);

export default ApiStatusIndicator;
