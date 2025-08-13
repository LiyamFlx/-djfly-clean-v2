import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  runAllHealthChecks,
  HealthCheckResult,
  ServiceName,
  ServiceStatus,
} from '@/utils/apiHealth';

type ServiceState = Partial<Record<ServiceName, HealthCheckResult>>;

const ApiStatusIndicator: React.FC = () => {
  const [services, setServices] = useState<ServiceState>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Initial status check on mount
    testAllConnections();
  }, []);

  const testAllConnections = async () => {
    setIsTesting(true);
    try {
      const results = await runAllHealthChecks();
      const newState: ServiceState = {};
      results.forEach((result) => {
        newState[result.service] = result;
      });
      setServices(newState);
    } catch (error) {
      console.error('Failed to test connections:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const getOverallStatus = (): ServiceStatus => {
    const statuses = Object.values(services).map((s) => s?.status);
    if (statuses.every((s) => s === 'connected')) return 'connected';
    if (statuses.some((s) => s === 'connected')) return 'degraded';
    if (statuses.every((s) => s === 'demo')) return 'demo';
    return 'disconnected';
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'demo':
        return 'text-blue-400';
      default:
        return 'text-red-400';
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'connected':
        return '🟢';
      case 'degraded':
        return '🟡';
      case 'demo':
        return '🔵';
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors hover:bg-gray-700 w-full text-left ${getStatusColor(overallStatus)}`}
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
                <div className="space-y-2">
                  <ServiceStatusRow
                    result={services.spotify}
                    name="Spotify"
                    description="Music data & tracks"
                  />
                  <ServiceStatusRow
                    result={services.supabase}
                    name="Supabase"
                    description="Database & storage"
                  />
                  <ServiceStatusRow
                    result={services.openai}
                    name="OpenAI"
                    description="AI recommendations"
                  />
                </div>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const ServiceStatusRow: React.FC<{
  result: HealthCheckResult | undefined;
  name: string;
  description: string;
}> = ({ result, name, description }) => {
  const status = result?.status || 'disconnected';
  const _message = result?.message || 'Not tested';

  const statusStyles: Record<ServiceStatus, string> = {
    connected: 'bg-green-900 text-green-300',
    disconnected: 'bg-red-900 text-red-300',
    degraded: 'bg-yellow-900 text-yellow-300',
    demo: 'bg-blue-900 text-blue-300',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-medium ${status !== 'disconnected' ? 'text-white' : 'text-gray-400'}`}
          >
            {name}
          </span>
          <span className="text-xs">
            {status === 'connected' ? '✅' : status === 'demo' ? '🔵' : '❌'}
          </span>
        </div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div
        className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusStyles[status]}`}
      >
        {status}
      </div>
    </div>
  );
};

export default ApiStatusIndicator;
