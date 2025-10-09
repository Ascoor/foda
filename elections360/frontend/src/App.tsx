import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Voters from './pages/Voters';
import Committees from './pages/Committees';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import Activities from './pages/Activities';
import MapView from './pages/MapView';
import AppLayout from './components/layout/AppLayout';

const App = () => (
  <AppLayout>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/voters" element={<Voters />} />
      <Route path="/committees" element={<Committees />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/map" element={<MapView />} />
    </Routes>
  </AppLayout>
);

export default App;
