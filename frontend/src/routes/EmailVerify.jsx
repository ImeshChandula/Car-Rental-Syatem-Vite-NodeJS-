import { useState, useEffect  } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Mail, Clock, CheckCircle  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmailVerify.css';

const EmailVerify = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState('email'); // email, otp, success
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    // Handle countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        
        return () => clearInterval(timer);
    }, [countdown]);
    
    // Navigate to login after success
    useEffect(() => {
        let redirectTimer;
        if (step === 'success') {
            redirectTimer = setTimeout(() => {
                navigate('/login');
            }, 5000);
        }
        
        return () => clearTimeout(redirectTimer);
    }, [step, navigate]);
    
    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
          if (nextInput) nextInput.focus();
        }
    };
    
    // Handle key down in OTP inputs
    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace') {
          if (!otp[index] && index > 0) {
              const prevInput = document.getElementById(`otp-${index - 1}`);
              if (prevInput) prevInput.focus();
          }
        }
    };
    
    // Handle request OTP
    const handleRequestOtp = async () => {
        if (!email || !email.includes('@') || !email.includes('.')) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        setLoading(true);
        try {
            const response = await axiosInstance.post('/password/sendVerifyOtp', { email });
            
            if (response.data && response.data.success) {
                toast.success(response.data.message || 'OTP sent successfully');
                setStep('otp');
                setCountdown(150); // 2 minutes and 30 seconds
            } else {
                toast.error(response.data?.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle OTP verification
    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');
        
        if (otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }
        
        setLoading(true);
        try {
            const response = await axiosInstance.post('/password/verifyEmail', { 
                email,
                otp: otpValue
            });
            
            if (response.data && response.data.success) {
                toast.success(response.data.message || 'Email verified successfully');
                setStep('success');
            } else {
                toast.error(response.data?.message || 'Invalid OTP');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle resend OTP
    const handleResendOtp = () => {
        if (countdown === 0) {
            handleRequestOtp();
        }
    };


  return (
    <div className="email-verify-container">
      <div className="email-verify-card">
        <div className="email-verify-header">
          <Mail className="email-icon" />
          <h1>Verify Your Email</h1>
          <p className="subtitle">
            {step === 'email' && "Please verify your email address to continue"}
            {step === 'otp' && "Enter the 6-digit code sent to your email"}
            {step === 'success' && "Email verification successful!"}
          </p>
        </div>
        
        <div className="email-verify-body">
          {step === 'email' && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button 
                className="primary-button"
                onClick={handleRequestOtp}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Get OTP'}
              </button>
            </>
          )}
          
          {step === 'otp' && (
            <>
              <div className="email-info">
                <p>We've sent a code to: <strong>{email}</strong></p>
              </div>
              
              <div className="countdown">
                <Clock size={16} />
                <span>{formatTime(countdown)}</span>
              </div>
              
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="primary-button"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                
                <button 
                  className={`resend-button ${countdown > 0 ? 'disabled' : ''}`}
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                >
                  {countdown > 0 ? `Resend OTP in ${formatTime(countdown)}` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}
          
          {step === 'success' && (
            <div className="success-message">
              <CheckCircle size={48} className="success-icon" />
              <p>Your email has been verified successfully!</p>
              <p className="redirect-text">Redirecting to login page in 5 seconds...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerify