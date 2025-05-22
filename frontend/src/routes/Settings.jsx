import { useEffect, useState } from 'react';
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import avatar from "../assets/avatar.jpg";
import toast from 'react-hot-toast';
import '../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { logout } = useAuthStore();

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("users/getLoggedUserProfile");

      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error("Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Compress and convert file to base64
  /*const compressImage = (file, maxWidth = 1200, quality = 0.9) => { // Higher quality settings
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };*/

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      const base64Image = await convertToBase64(file);
      //const base64Image = await compressImage(file);

      const response = await axiosInstance.patch(`/users/updateUserProfileImage/${user.id}`, {
        profilePicture: base64Image
      });

      console.log('Upload response:', response.data);

      // Update user state with new profile picture
      if (response.data && response.data.updatedUser) {
        setUser(prevUser => ({
          ...prevUser,
          profilePicture: response.data.updatedUser.profilePicture || base64Image
        }));
      } else {
        console.error('Unexpected response structure:', response.data);
        // Fallback: just use the base64 image
        setUser(prevUser => ({
          ...prevUser,
          profilePicture: base64Image
        }));
      }

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture. Please try again.');
    } finally {
      setUploadingImage(false);
      // Clear the input
      event.target.value = '';
    }
  };

  // Handle case when authUser is null or doesn't have an id
  const deleteUser = async () => {
    if (!user || !user.id) {
      toast.error("Cannot delete account: User information not loaded");
      return;
    }

    try {
      await axiosInstance.delete(`/users/deleteUserById/${user.id}`);
      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      deleteUser();
    }
  };

  if (loading) return (
    <div className="profile-loading-container">
      <div className="profile-loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );
  
  if (!user) return (
    <div className="profile-error-container">
      <div className="profile-error-icon">!</div>
      <p>User not found. Please try logging in again.</p>
    </div>
  );



  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-container">
          <img
            src={!user.profilePicture ? avatar : user.profilePicture}
            alt="Profile"
            className="profile-image"
          />
          <div className='update-photo-container'>
            <input 
              type='file'
              id='profile-image-input'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="update-photo-btn"
              onClick={() => document.getElementById('profile-image-input').click()}
              disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading' : 'Update Photo'}
              </button>
          </div>
        </div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <div className="detail-row">
            <div className="detail-icon">✉️</div>
            <div className="detail-info">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-icon">📱</div>
            <div className="detail-info">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{user.phone}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-icon">🪪</div>
            <div className="detail-info">
              <span className="detail-label">License Number</span>
              <span className="detail-value">{user.licenseNumber}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-icon">👤</div>
            <div className="detail-info">
              <span className="detail-label">Role</span>
              <span className="detail-value">{user.role}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-icon">📅</div>
            <div className="detail-info">
              <span className="detail-label">Joined</span>
              <span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-actions">
        <button className="edit-button" onClick={() => navigate('/reset/password')}>Reset My Password</button>
        <button className="delete-button" onClick={handleDelete}>Delete My Account</button>
      </div>
    </div>
  )
}

export default Settings