import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OnboardMandir from './pages/OnboardMandir';
import HireStaff from './pages/HireStaff';
import MandirList from './pages/MandirList';
import StaffList from './pages/StaffList';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboard-mandir" element={<OnboardMandir />} />
          <Route path="/hire-staff" element={<HireStaff />} />
          <Route path="/mandirs" element={<MandirList />} />
          <Route path="/staff" element={<StaffList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
