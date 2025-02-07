import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validateIncome } from '../utils/validation';
import Notification from './Notification';

function UserProfile() {
  const { updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    occupation: '',
    hasBusinessIncome: false,
    hasCapitalGains: false,
    hasForeignIncome: false,
    houseProperties: 0
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate income
    const incomeValidation = validateIncome(formData.income);
    if (!incomeValidation.isValid) {
      newErrors.income = incomeValidation.errors[0];
    }

    // Validate other fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.age || formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (Object.keys(newErrors).length === 0) {
      updateUserProfile(formData);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setErrors(newErrors);
      setNotification({
        type: 'error',
        message: 'Please fix the errors in the form.'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="user-profile">
      <div 
        className="collapsible-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2>Your Profile</h2>
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <span className="error">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="income">Annual Income</label>
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
            />
            {errors.income && <span className="error">{errors.income}</span>}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="hasBusinessIncome"
                checked={formData.hasBusinessIncome}
                onChange={handleChange}
              />
              Do you have business income?
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="hasCapitalGains"
                checked={formData.hasCapitalGains}
                onChange={handleChange}
              />
              Do you have capital gains?
            </label>
          </div>

          <button type="submit" className="submit-button">
            Update Profile
          </button>
        </form>
      </div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default UserProfile; 