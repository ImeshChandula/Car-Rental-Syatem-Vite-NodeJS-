import { useState} from 'react';
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, IdCard, Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!formData.phone) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.licenseNumber) {
      toast.error("License number is required");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   const isValid = validateForm();
    if (!isValid) return;
    
    try {
      const result = await signup(formData);
      if (result && result.user) {
        setMessage("New account created successfully.");
        navigate('/email/verify');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is already handled in the signup function with toast
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
          <h1 className='form-head-text'>Create Account</h1>
          <p className='form-head-text-paragraph'>Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit} className='form'>
          <div className='form-field'>
            <label className='form-label'>User Name</label>
            <div className='input-group'>
              <User className='icon'/> 
              <input
                type="text"
                name="name"
                placeholder="John Beard"
                value={formData.name}
                onChange={handleChange}
                required
                className='form-input'
              />
            </div>
          </div>

          <div className='form-field'>
            <label className='form-label'>Email</label>
            <div className='input-group'>
              <Mail className='icon'/> 
              <input
                type="email"
                name="email"
                placeholder="your@example.com"
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

          <div className='form-field'>
            <label className='form-label'>Phone</label>
            <div className='input-group'>
              <Phone className='icon'/> 
              <input
                type="text"
                name="phone"
                placeholder="+94702222222"
                value={formData.phone}
                onChange={handleChange}
                required
                className='form-input'
              />
            </div>
          </div>

          <div className='form-field'>
            <label className='form-label'>License Number</label>
            <div className='input-group'>
              <IdCard className='icon'/> 
              <input
                type="text"
                name="licenseNumber"
                placeholder="B22222222"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className='form-input'
              />
            </div>
          </div>

          <button type='submit' className='btn'>
              {isSigningUp ? (
                <>
                  <Loader2 />Loading...
                </>
              ) : (
                "Create Account"
              )}
          </button>
        </form>

        <div className='link-section'>
          <p className='paragraph-link'>Already have an account?{" "}
            <Link to="/login" className=''>Sign in</Link>
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

export default Register