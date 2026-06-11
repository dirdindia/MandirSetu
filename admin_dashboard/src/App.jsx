import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OnboardMandir from './pages/onboarding/OnboardMandir';
import OnboardDham from './pages/onboarding/OnboardDham';
import HireStaff from './pages/onboarding/HireStaff';
import EditStaff from './pages/directories/EditStaff';
import MandirList from './pages/directories/MandirList';
import DhamList from './pages/directories/DhamList';
import StaffList from './pages/directories/StaffList';
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
          <Route path="/onboard-dham" element={<OnboardDham />} />
          <Route path="/hire-staff" element={<HireStaff />} />
          <Route path="/edit-staff/:id" element={<EditStaff />} />
          <Route path="/mandirs" element={<MandirList />} />
          <Route path="/dhams" element={<DhamList />} />
          <Route path="/staff" element={<StaffList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
