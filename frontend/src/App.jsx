import { useState } from 'react';
import Login from './components/Login';
import UserDashboard from './pages/UserDashboard';
import DefenseDashboard from './pages/DefenseDashboard';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('login');

  return (
    <>
      {activeView === 'login' && <Login onNavigate={setActiveView} />}
      {activeView === 'user' && <UserDashboard onNavigate={setActiveView} />}
      {activeView === 'defense' && <DefenseDashboard onNavigate={setActiveView} />}
    </>
  );
}

export default App;