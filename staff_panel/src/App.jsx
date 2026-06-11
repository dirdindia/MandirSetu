import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OnboardHotel from './pages/onboarding/OnboardHotel';
import OnboardRestaurant from './pages/onboarding/OnboardRestaurant';
import OnboardAshram from './pages/onboarding/OnboardAshram';
import Settings from './pages/Settings';
import HotelList from './pages/directories/HotelList';
import RestaurantList from './pages/directories/RestaurantList';
import AshramList from './pages/directories/AshramList';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding/hotel" element={<OnboardHotel />} />
          <Route path="/onboarding/restaurant" element={<OnboardRestaurant />} />
          <Route path="/onboarding/ashram" element={<OnboardAshram />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/directories/hotels" element={<HotelList />} />
          <Route path="/directories/restaurants" element={<RestaurantList />} />
          <Route path="/directories/ashrams" element={<AshramList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
