import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './utils/testApiConnections';

// Suppress browser extension errors
window.addEventListener('error', (event) => {
  if (
    event.message.includes('Extension context invalidated') ||
    event.message.includes('message channel closed') ||
    event.message.includes('Receiving end does not exist')
  ) {
    event.preventDefault();
    return false;
  }
});

// Suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('Extension context invalidated') ||
    event.reason?.message?.includes('message channel closed') ||
    event.reason?.message?.includes('Receiving end does not exist')
  ) {
    event.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
