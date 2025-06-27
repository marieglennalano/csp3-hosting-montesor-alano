import { useContext } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaShoppingCart } from 'react-icons/fa';

import UserContext from '../../context/UserContext';
import logo from '../../images/logo.png';
import './AppNavbar.css';

export default function AppNavbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/products');
  };

  return (
    <Navbar expand="lg" className="custom-navbar" sticky="top">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="navbar-logo-container">
          <img src={logo} alt="SkinCredible Hulk Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav" className="justify-content-end">
          <Nav className="navbar-right-links d-flex align-items-center ms-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>

            {user?.id ? (
              <>
                {/* Show Profile for both admin and non-admin users */}
                <Nav.Link as={NavLink} to="/profile">View Profile</Nav.Link>
                {!user?.isAdmin && (
                  <Nav.Link as={NavLink} to="/my-orders">My Orders</Nav.Link>
                )}
                <Nav.Link as={NavLink} to="/login" onClick={logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}

            <Nav.Link as={NavLink} to="/contact">Contact Us</Nav.Link>

            {/* Show cart only if a non-admin user is logged in */}
            {user?.id && !user?.isAdmin && (
              <div className="navbar-cart-icon d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
                <Link to="/cart" className="cart-icon-link">
                  <FaShoppingCart size={20} />
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
