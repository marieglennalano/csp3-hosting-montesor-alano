import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar/AppNavbar';

// [SECTION] Import Pages / Components
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import Register from './pages/Register/Register';
import Products from './pages/Products/Products';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Contact from './pages/ContactUs/Contact';
import Home from './pages/Home/Home';


function App() {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { id: null };
  });

  // Keep user in sync with localStorage
  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Function for clearing localStorage on logout
  function unsetUser() {
    localStorage.clear();
    setUser({ id: null });
  }

  return (
    <UserProvider value={{ user, setUser }}>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<OrderHistory />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;