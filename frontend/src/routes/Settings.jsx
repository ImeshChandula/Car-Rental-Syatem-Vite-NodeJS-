import { useEffect, useState } from 'react';
import { axiosInstance } from "../lib/axios";
import avatar from "../assets/avatar.jpg";
import '../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("users/getLoggedUserProfile");

      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) return <p className="profile-loading">Loading profile...</p>;
  if (!user) return <p className="profile-error">User not found.</p>;



  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={!user.profilePicture ? avatar :  user.profilePicture}
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>License Number:</strong> {user.licenseNumber}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Settings