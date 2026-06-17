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

import Products from './pages/ecommerce/Products';
import Categories from './pages/ecommerce/Categories';
import Coupons from './pages/ecommerce/Coupons';
import Orders from './pages/ecommerce/Orders';
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
          <Route path="/onboarding/hotel" element={<OnboardHotel />} />
          <Route path="/onboarding/restaurant" element={<OnboardRestaurant />} />
          <Route path="/onboarding/ashram" element={<OnboardAshram />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/directories/hotels" element={<HotelList />} />
          <Route path="/directories/restaurants" element={<RestaurantList />} />
          <Route path="/directories/ashrams" element={<AshramList />} />
          
          <Route path="/ecommerce/overview" element={<Overview />} />
          <Route path="/ecommerce/products" element={<Products />} />
          <Route path="/ecommerce/categories" element={<Categories />} />
          <Route path="/ecommerce/coupons" element={<Coupons />} />
          <Route path="/ecommerce/orders" element={<Orders />} />
          <Route path="/ecommerce/customers" element={<Customers />} />
          <Route path="/ecommerce/returns" element={<Returns />} />
          <Route path="/ecommerce/feedback" element={<Feedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
