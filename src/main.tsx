import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initSentry } from './lib/sentry';
import { AppErrorBoundary } from './components/ErrorBoundary';

// Initialize Sentry
initSentry();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);