import { useEffect, useState } from 'react';
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from '../store/useAuthStore';
import avatar from "../assets/avatar.jpg";
import toast from 'react-hot-toast';
import '../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      <div className="profile-header">
        <h1>Account Settings</h1>
      </div>
      <div className="profile-card">
        <div className="profile-image-container">
          <img
            src={!user.profilePicture ? avatar : user.profilePicture}
            alt="Profile"
            className="profile-image"
          />
          <button className="update-photo-btn">Update Photo</button>
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
        <button className="edit-button">Edit Profile</button>
        <button className="delete-button" onClick={handleDelete}>Delete My Account</button>
      </div>
    </div>
  )
}

export default Settings