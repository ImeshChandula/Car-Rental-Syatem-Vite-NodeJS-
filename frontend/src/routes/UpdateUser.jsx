import { useEffect, useState } from 'react';
import { axiosInstance } from "../lib/axios";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/EditUserData.css';

const UpdateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nic: ''
  });

  // Fetch current user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/myProfile/get");
      
      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          licenseNumber: userData.licenseNumber || ''
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error(error.response?.data?.message ||"Failed to load profile information");
      // Navigate back to settings if can't fetch data
      navigate('/settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      toast.error("User information not available");
      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setUpdating(true);
      
      const response = await axiosInstance.patch(`/myProfile/update/account/${user.id}`, formData);
      
      if (response.data && response.data.success) {
        toast.success(response.data.message || "Profile updated successfully!");
        toast.success("Redirecting to settings in 5 seconds...");
        
        setTimeout(() => {
          navigate('/settings');
        }, 5000);
      } else {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <div className="edit-loading-container">
        <div className="edit-loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="edit-error-container">
        <div className="edit-error-icon">!</div>
        <p>Unable to load user data. Please try again.</p>
        <button onClick={() => navigate('/settings')} className="back-button">
          Back to Settings
        </button>
      </div>
    );
  }
  return (
    <div className="edit-user-container">
      <div className="edit-user-card">
        <div className="edit-header">
          <h2>Edit Profile Information</h2>
          <p>Update your personal details below. Email cannot be changed.</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email (Cannot be changed)
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nic" className="form-label">
              NIC Number
            </label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your NIC number"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateUser