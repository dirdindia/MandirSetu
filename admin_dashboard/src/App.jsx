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
import SevadarRequests from './pages/directories/SevadarRequests';
import GroupBookings from './pages/GroupBookings';
import EntityDetailsLayout from './pages/directories/entityDetails/EntityDetailsLayout';
import EntityOverview from './pages/directories/entityDetails/EntityOverview';
import EntityHotels from './pages/directories/entityDetails/EntityHotels';
import EntityRestaurants from './pages/directories/entityDetails/EntityRestaurants';
import EntityAshrams from './pages/directories/entityDetails/EntityAshrams';
import EntityEcommerce from './pages/directories/entityDetails/EntityEcommerce';
import CreateEvent from './pages/onboarding/CreateEvent';
import EventsList from './pages/directories/EventsList';
import Layout from './components/Layout';
import Products from './pages/ecommerce/Products';
import Categories from './pages/ecommerce/Categories';
import Orders from './pages/ecommerce/Orders';
import Coupons from './pages/ecommerce/Coupons';
import Overview from './pages/ecommerce/Overview';
import Customers from './pages/ecommerce/Customers';
import Returns from './pages/ecommerce/Returns';
import Feedback from './pages/ecommerce/Feedback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboard-mandir" element={<OnboardMandir />} />
          <Route path="onboard-dham" element={<OnboardDham />} />
          <Route path="hire-staff" element={<HireStaff />} />
          <Route path="/edit-staff/:id" element={<EditStaff />} />
          
          {/* Booking & Management */}
          <Route path="group-bookings" element={<GroupBookings />} />
          <Route path="settings" element={<div className="p-8">Settings Page Coming Soon</div>} />
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
          <Route path="/sevadar-requests" element={<SevadarRequests />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events" element={<EventsList />} />
          
          {/* E-Commerce */}
          <Route path="/ecommerce/overview" element={<Overview />} />
          <Route path="/ecommerce/products" element={<Products />} />
          <Route path="/ecommerce/categories" element={<Categories />} />
          <Route path="/ecommerce/orders" element={<Orders />} />
          <Route path="/ecommerce/coupons" element={<Coupons />} />
          <Route path="/ecommerce/customers" element={<Customers />} />
          <Route path="/ecommerce/returns" element={<Returns />} />
          <Route path="/ecommerce/feedback" element={<Feedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
