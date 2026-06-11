import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/landing/Home';
import Gallery from './pages/landing/Gallery';
import About from './pages/landing/About';
import Contact from './pages/landing/Contact';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Mandirs from './pages/mandirs/Mandirs';
import MandirDetail from './pages/mandirs/MandirDetail';
import Dhams from './pages/dhams/Dhams';
import DhamDetail from './pages/dhams/DhamDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="mandirs" element={<Mandirs />} />
          <Route path="mandir/:id" element={<MandirDetail />} />
          <Route path="dhams" element={<Dhams />} />
          <Route path="dham/:id" element={<DhamDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
