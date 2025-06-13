import React, { useState, useEffect, useRef  } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { CircleDashed, LogIn, LogOut, Menu, Settings, X, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import "../styles/Navbar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Debug log to see authUser value
  //useEffect(() => {
  //  console.log("NavBar authUser:", authUser);
  //}, [authUser]);

  // check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // handle Click Outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout successful")
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
                  <Link to="/login" className="btn-secondary nav-dropdown-trigger" onClick={() => setIsMenuOpen(false)}>
                    <LogIn size={20} />
                    <span>Log in</span>
                  </Link>
                ) : (
                  <>
                    {isMobile ? (
                      <>
                        <span className='mobile-menu-divider'></span>

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
                    ) : (
                      <div className="nav-dropdown-container" ref={dropdownRef}>
                        <button 
                          className="btn-secondary nav-dropdown-trigger" 
                          onClick={toggleDropdown}
                          aria-expanded={isDropdownOpen}
                        >
                          <User size={20} />
                          <span>Account</span>
                          <ChevronDown size={16} className={`nav-dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                          <div className="nav-dropdown-menu">
                            <button className="nav-dropdown-item" onClick={goToDashboard}>
                              <CircleDashed size={20} />
                              <span>Dashboard</span>
                            </button>

                            <button className='nav-dropdown-item' onClick={handleSettings}>
                              <Settings size={20} />
                              <span>Settings</span>
                            </button>

                            <div className="nav-dropdown-divider"></div>

                            <button className="nav-dropdown-item nav-logout-item" onClick={handleLogout}>
                              <LogOut size={20} />
                              <span>Logout</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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