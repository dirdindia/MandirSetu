import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OnboardMandir from './pages/onboarding/OnboardMandir';
import OnboardDham from './pages/onboarding/OnboardDham';
import HireStaff from './pages/onboarding/HireStaff';
import EditStaff from './pages/directories/EditStaff';
import EditMandir from './pages/directories/EditMandir';
import EditDham from './pages/directories/EditDham';
import MandirList from './pages/directories/MandirList';
import DhamList from './pages/directories/DhamList';
import StaffList from './pages/directories/StaffList';
import EntityDetailsLayout from './pages/directories/entityDetails/EntityDetailsLayout';
import EntityOverview from './pages/directories/entityDetails/EntityOverview';
import EntityHotels from './pages/directories/entityDetails/EntityHotels';
import EntityRestaurants from './pages/directories/entityDetails/EntityRestaurants';
import EntityAshrams from './pages/directories/entityDetails/EntityAshrams';
import EntityEcommerce from './pages/directories/entityDetails/EntityEcommerce';
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
          <Route path="/edit-mandir/:id" element={<EditMandir />} />
          <Route path="/edit-dham/:id" element={<EditDham />} />
          <Route path="/mandirs" element={<MandirList />} />
          <Route path="/dhams" element={<DhamList />} />
          <Route path="/mandirs/:id/details" element={<EntityDetailsLayout type="mandir" />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<EntityOverview />} />
            <Route path="hotels" element={<EntityHotels />} />
            <Route path="restaurants" element={<EntityRestaurants />} />
            <Route path="ashrams" element={<EntityAshrams />} />
            <Route path="ecommerce" element={<EntityEcommerce />} />
          </Route>
          <Route path="/dhams/:id/details" element={<EntityDetailsLayout type="dham" />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<EntityOverview />} />
            <Route path="hotels" element={<EntityHotels />} />
            <Route path="restaurants" element={<EntityRestaurants />} />
            <Route path="ashrams" element={<EntityAshrams />} />
            <Route path="ecommerce" element={<EntityEcommerce />} />
          </Route>
          <Route path="/staff" element={<StaffList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
