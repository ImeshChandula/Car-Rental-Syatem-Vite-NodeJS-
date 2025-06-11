import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import GoogleLogin from '../components/GoogleLogin';
import { Car, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import "../styles/Register.css";
import "../styles/GoogleLogin.css";

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

    try {
      // Clean up email before submission
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      const result = await login(loginData);
      if (result && result.user){
        setMessage("User logged successfully.");
        toast.success(result.message);
      }
      // We'll let the toast in the auth store handle success messages
    } catch (error) {
      console.error("Login submission error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = (result) => {
    console.log('Google login successful:', result);
    toast.success('Google login successful:', result);
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
    setMessage("Google login failed. Please try again.");
    toast.error("Google login failed. Please try again.");
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
            <p className='forgot-password'>
              <Link to="/email/verify" className=''>Verify Email..!</Link>
            </p>
            <p className='forgot-password'>
              <Link to="/reset/password" className=''>Forgot password ?</Link>
            </p>
          </div>

          {/* Divider */}
          <div className='divider'>
            <div className='divider-line'></div>
            <span className='divider-text'>or</span>
            <div className='divider-line'></div>
          </div>

          {/* Google Login Section */}
          <div className='google-login-section'>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={isLoggingIn}
            />
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