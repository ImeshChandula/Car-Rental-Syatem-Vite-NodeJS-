import { GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const GoogleLogin = ({ onSuccess, onError, disabled }) => {
    const { googleLogin, isGoogleLoading } = useAuthStore();
    
    const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential received:", credentialResponse);
      const result = await googleLogin(credentialResponse.credential);
      if (result && onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Google login error in component:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Login Failed:', error);
    if (onError) {
      onError(error);
    }
  };

  if (isGoogleLoading) {
    return (
      <div className="google-login-loading">
        <Loader2 className="animate-spin" />
        <span>Signing in with Google...</span>
      </div>
    );
  }



  return (
    <div style={{ width: '100%' }}>
      <GoogleOAuthLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        disabled={disabled}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="400"
        auto_select={false}
        cancel_on_tap_outside={true}
      />
    </div>
  )
}

export default GoogleLogin