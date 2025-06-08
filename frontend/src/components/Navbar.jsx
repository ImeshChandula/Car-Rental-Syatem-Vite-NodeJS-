import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Car, CircleDashed, LogIn, LogOut, Menu, Settings, X } from 'lucide-react';
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

  const handleSettings = () => {
    navigate("/settings");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
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

            <div className="navbar-inner-left">
              <div className="navbar-logo">
                <Link to="/" className="logo-link">
                  <div className="logo-icon">🚗</div>
                  <span className="logo-text" style={{fontSize: '1.5rem'}}>{import.meta.env.VITE_APP_ORG_NAME}Pro</span>
                </Link>
              </div>
            </div>

            <div className="navbar-inner-right">
              <nav className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
                
                <a href="/" className="nav-link" onClick={handleLinkClick}>Home</a>
                <a href="/cars" className="nav-link" onClick={handleLinkClick}>Cars</a>
                <a href="/about" className="nav-link" onClick={handleLinkClick}>About Us</a>
                <a href="/services" className="nav-link" onClick={handleLinkClick}>Services</a>
                <a href="/contact" className="nav-link" onClick={handleLinkClick}>Contact</a>
                
                {!authUser ? (
                  <Link to="/login" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    <LogIn size={20} />
                    <span>Log in</span>
                  </Link>
                ) : (
                  <>
                    <button className="btn-secondary" onClick={goToDashboard}>
                      <CircleDashed size={20} />
                      <span>Dashboard</span>
                    </button>

                    <button className='btn-secondary' onClick={handleSettings}>
                      <Settings size={20} />
                      <span>Settings</span>
                    </button>

                    <button className="btn-primary" onClick={handleLogout}>
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
        </div>
      </header>
    </div>
  )
}

export default NavBar