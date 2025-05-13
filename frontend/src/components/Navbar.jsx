import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Car, CircleDashed, LogIn, LogOut, Menu, X } from 'lucide-react';
import "../styles/NavBar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  // Debug log to see authUser value
  useEffect(() => {
    console.log("NavBar authUser:", authUser);
  }, [authUser]);

  const goToDashboard = () => {
    if (authUser && authUser.role) {
      switch (authUser.role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'owner':
          navigate('/owner/dashboard');
          break;
        default:
          navigate('/');
          break;
      }

      setIsMenuOpen(false);
    } else {
      console.error("Cannot navigate to dashboard: User role not available");
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container">
      <header className="navbar">
        <div className="navbar-content">
          <div className="navbar-inner">
            <div className="navbar-logo">
              <Link to="/" className="logo-link">
                <div className="logo-icon"><Car size={24} /></div>
                <h1 className="logo-text">Car Rental System</h1>
              </Link>
            </div>

            <nav className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
              {!authUser ? (
                <Link to="/login" className="nav-link login-link" onClick={() => setIsMenuOpen(false)}>
                  <LogIn size={20} />
                  <span>Log in</span>
                </Link>
              ) : (
                <>
                  <button className="nav-button dashboard-button" onClick={goToDashboard}>
                    <CircleDashed size={20} />
                    <span>Dashboard</span>
                  </button>

                  <button className="nav-button logout-button" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
            
            <div className="navbar-menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default NavBar