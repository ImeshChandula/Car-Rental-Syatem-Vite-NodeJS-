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
      <header className="header">
        <div className="container">
          <div className="header-content">

            <div className="header-left">
              <div className="logo">
                <Link to="/" className="logo-link">
                  <div className="logo-icon"><Car size={24} /></div>
                  <span className="logo-text">Car Rental System</span>
                </Link>
              </div>
            </div>
            
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <a href="#home" className="nav-link" onClick={handleLinkClick}>Home</a>
              <a href="#cars" className="nav-link" onClick={handleLinkClick}>Cars</a>
              <a href="#about" className="nav-link" onClick={handleLinkClick}>About</a>
              <a href="#services" className="nav-link" onClick={handleLinkClick}>Services</a>
              <a href="#contact" className="nav-link" onClick={handleLinkClick}>Contact</a>
              
              {/* Mobile menu actions */}
              <div className="mobile-actions">
                {!authUser ? (
                  <Link to="/login" className="btn-secondary mobile-btn" onClick={handleLinkClick}>
                    <LogIn size={20} />
                    <span>Log in</span>
                  </Link>
                ) : (
                  <>
                    <button className="btn-secondary mobile-btn" onClick={goToDashboard}>
                      <CircleDashed size={20} />
                      <span>Dashboard</span>
                    </button>

                    <button className='btn-secondary mobile-btn' onClick={handleSettings}>
                      <Settings size={20} />
                      <span>Settings</span>
                    </button>

                    <button className="btn-primary mobile-btn" onClick={handleLogout}>
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </nav>
              
            <div className="header-right">
              <div className="header-actions">
              {!authUser ? (
                  <>
                    <Link to="/login" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                      <LogIn size={20} />
                      <span>Log in</span>
                    </Link>
                  </>
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
                </div>

                <button className="mobile-menu-toggle" onClick={toggleMenu}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

          </div>
        </div>
      </header>
  )
}

export default NavBar