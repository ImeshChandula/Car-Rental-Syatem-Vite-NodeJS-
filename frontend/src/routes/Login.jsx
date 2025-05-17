import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Car, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import "../styles/Register.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {login, isLoggingIn} = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Clean up email before submission
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      await login(loginData);
      // We'll let the toast in the auth store handle success messages
    } catch (error) {
      console.error("Login submission error:", error);
      setMessage(error.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className='_whole'>
    <div className='_body'>
    <div className='form-container'>
      <div className='form-body'>
        <div className='form-head'>
          <div className='form-head-icon'>
            <Car className='form-head-icon' />
          </div>
          <h1 className='form-head-text'>Welcome Back</h1>
          <p className='form-head-text-paragraph'>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className='form'>
          <div className='form-field'>
            <label className='form-label'>Email</label>
            <div className='input-group'>
              <Mail className='icon'/> 
              <input
                type="email"
                name="email"
                placeholder="yourmail@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className='form-input'
              />
            </div>
          </div>

          <div className='form-field'>
            <label className='form-label'>Password</label>
            <div className='input-group'>
              <Lock className='icon'/> 
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                className='form-input'
              />
              <button
                type='button'
                className='toggle-password'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='icon'/>
                ) : (
                  <Eye className='icon'/>
                )}
              </button>
            </div>
          </div>

          <button type='submit' className='btn' disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 />Loading...
                </>
              ) : (
                "Sign in"
              )}
          </button>
        </form>

        <div className='link-section'>
          <p className='paragraph-link'>Don't have an account?{" "}
            <Link to="/register" className=''>Create account</Link>
          </p>
        </div>
        
        {message && (
          <div className="message-box">
              {message}
          </div>
        )}

      </div>
    </div>
    </div>
    </div>
  )
}

export default Login