import AppRouter from './components/AppRouter';
import AuthManager from './components/AuthManager';
import MultiTabManager from './components/MultiTabManager';

const App: React.FC = () => {
  return (
    <AuthManager>
      <MultiTabManager />
      <AppRouter />
    </AuthManager>
  );
};

export default App;