# Trading Dashboard

A modern, real-time trading dashboard built with React, TypeScript, and Tailwind CSS. This application provides stock market data, watchlist management, and a powerful stock screener.

## Features

- **Real-time Market Data**: Get up-to-date stock prices and market information
- **Interactive Watchlist**: Track your favorite stocks with automatic price updates
- **Advanced Stock Screener**: Filter stocks based on various criteria like price, volume, market cap, and more
- **Responsive Design**: Works on desktop and mobile devices
- **Data Caching**: Optimized API usage with intelligent caching

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- API keys for:
  - Alpha Vantage (free tier available)
  - Financial Modeling Prep (free tier available)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   VITE_FINANCIAL_MODELING_PREP_API_KEY=your_fmp_key
   ```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

```
src/features/trading/
├── components/         # Reusable UI components
├── services/          # API services and data fetching
├── store/             # State management with Zustand
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## API Documentation

- [Alpha Vantage API](https://www.alphavantage.co/documentation/)
- [Financial Modeling Prep API](https://site.financialmodelingprep.com/developer/docs/)

## License

This project is licensed under the MIT License.
