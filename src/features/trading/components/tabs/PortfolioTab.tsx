import React from 'react';
import { FiPieChart, FiPlus } from 'react-icons/fi';

interface PortfolioTabProps {
  portfolio: Record<
    string,
    {
      symbol: string;
      shares: number;
      averagePrice: number;
      currentPrice: number;
      marketValue: number;
      profitLoss: number;
      profitLossPercent: number;
    }
  >;
  onSelectStock: (symbol: string) => void;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({
  portfolio,
  onSelectStock,
}) => {
  const portfolioItems = Object.values(portfolio);
  const totalValue = portfolioItems.reduce(
    (sum, item) => sum + item.marketValue,
    0
  );
  const totalPL = portfolioItems.reduce(
    (sum, item) => sum + item.profitLoss,
    0
  );
  const totalPLPercent =
    totalValue > 0
      ? portfolioItems.reduce(
          (sum, item) => sum + item.profitLossPercent * item.marketValue,
          0
        ) / totalValue || 0
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Portfolio Summary</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">
                $
                {totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm mt-1">
                <span
                  className={totalPL >= 0 ? 'text-green-600' : 'text-red-600'}
                >
                  {totalPL >= 0 ? '+' : ''}$
                  {Math.abs(totalPL).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-gray-500 ml-2">
                  ({totalPLPercent >= 0 ? '+' : ''}
                  {totalPLPercent.toFixed(2)}%)
                </span>
              </p>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm">
              <FiPieChart className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Holdings</h2>
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            onClick={() => {}}
          >
            <FiPlus className="mr-1 h-4 w-4" />
            Add Funds
          </button>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You don't have any holdings yet</p>
            <p className="text-sm mt-2">
              Start by adding stocks to your portfolio
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Symbol
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Shares
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Avg. Cost
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Market Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      P/L
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolioItems.map((item) => (
                    <tr
                      key={item.symbol}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectStock(item.symbol)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{item.symbol}</div>
                        <div className="text-sm text-gray-500">
                          ${item.currentPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.shares.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        ${item.averagePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        $
                        {item.marketValue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-right ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        <div className="font-medium">
                          {item.profitLoss >= 0 ? '+' : ''}
                          {item.profitLoss.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-sm">
                          ({item.profitLossPercent >= 0 ? '+' : ''}
                          {item.profitLossPercent.toFixed(2)}%)
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioTab;
