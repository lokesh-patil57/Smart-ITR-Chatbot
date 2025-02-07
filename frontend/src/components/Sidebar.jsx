import React, { useState } from 'react';
import { FaUser, FaChartLine, FaFileAlt, FaBell, FaCog } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/Sidebar.css';

const mockTaxData = [
    { month: 'Jan', amount: 25000 },
    { month: 'Feb', amount: 28000 },
    { month: 'Mar', amount: 32000 },
    { month: 'Apr', amount: 27000 },
    { month: 'May', amount: 35000 },
    { month: 'Jun', amount: 30000 }
];

function Sidebar({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        income: '',
        occupation: '',
        taxRegime: 'new',
        notifications: true,
        darkMode: false
    });

    const [isEditing, setIsEditing] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Tax filing deadline approaching', read: false },
        { id: 2, text: 'New tax saving scheme available', read: false },
        { id: 3, text: 'Your profile was updated', read: true }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
        // Add notification
        setNotifications(prev => [
            { id: Date.now(), text: 'Profile updated successfully', read: false },
            ...prev
        ]);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfile();
            case 'analytics':
                return renderAnalytics();
            case 'documents':
                return renderDocuments();
            case 'notifications':
                return renderNotifications();
            case 'settings':
                return renderSettings();
            default:
                return renderProfile();
        }
    };

    const renderProfile = () => (
        isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            phone: e.target.value
                        }))}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="form-group">
                    <label>Annual Income</label>
                    <input
                        type="number"
                        value={profileData.income}
                        onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            income: e.target.value
                        }))}
                        placeholder="Enter your annual income"
                    />
                </div>

                <div className="form-group">
                    <label>Occupation</label>
                    <select
                        value={profileData.occupation}
                        onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            occupation: e.target.value
                        }))}
                    >
                        <option value="">Select Occupation</option>
                        <option value="salaried">Salaried</option>
                        <option value="business">Business</option>
                        <option value="professional">Professional</option>
                        <option value="retired">Retired</option>
                        <option value="student">Student</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Tax Regime</label>
                    <select
                        value={profileData.taxRegime}
                        onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            taxRegime: e.target.value
                        }))}
                    >
                        <option value="new">New Regime</option>
                        <option value="old">Old Regime</option>
                    </select>
                </div>

                <div className="button-group">
                    <button type="submit" className="save-btn">
                        Save Changes
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        ) : (
            <div className="profile-info">
                <div className="info-item">
                    <span className="label">Name:</span>
                    <span className="value">{profileData.name || 'Not set'}</span>
                </div>
                <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{profileData.email || 'Not set'}</span>
                </div>
                <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{profileData.phone || 'Not set'}</span>
                </div>
                <div className="info-item">
                    <span className="label">Income:</span>
                    <span className="value">
                        {profileData.income ? `₹${parseInt(profileData.income).toLocaleString()}` : 'Not set'}
                    </span>
                </div>
                <div className="info-item">
                    <span className="label">Occupation:</span>
                    <span className="value">
                        {profileData.occupation ? profileData.occupation.charAt(0).toUpperCase() + profileData.occupation.slice(1) : 'Not set'}
                    </span>
                </div>

                <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                >
                    Edit Profile
                </button>
            </div>
        )
    );

    const renderAnalytics = () => (
        <div className="analytics-section">
            <h3>Tax Payment History</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockTaxData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke={getComputedStyle(document.documentElement).getPropertyValue('--accent-color')} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="tax-summary">
                <div className="summary-item">
                    <span>Total Tax Paid</span>
                    <span>₹1,77,000</span>
                </div>
                <div className="summary-item">
                    <span>Tax Savings</span>
                    <span>₹45,000</span>
                </div>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="documents-section">
            <h3>Required Documents</h3>
            <div className="document-list">
                <div className="document-item">
                    <span>Form 16</span>
                    <button className="upload-btn">Upload</button>
                </div>
                <div className="document-item">
                    <span>PAN Card</span>
                    <button className="upload-btn">Upload</button>
                </div>
                <div className="document-item">
                    <span>Aadhaar Card</span>
                    <button className="upload-btn">Upload</button>
                </div>
                <div className="document-item">
                    <span>Investment Proofs</span>
                    <button className="upload-btn">Upload</button>
                </div>
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="notifications-section">
            <h3>Notifications</h3>
            <div className="notification-list">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.read ? 'read' : ''}`}>
                        <span>{notification.text}</span>
                        {!notification.read && (
                            <button 
                                className="mark-read-btn"
                                onClick={() => markNotificationRead(notification.id)}
                            >
                                Mark as read
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="settings-section">
            <h3>Settings</h3>
            <div className="settings-list">
                <div className="setting-item">
                    <span>Enable Notifications</span>
                    <label className="switch">
                        <input 
                            type="checkbox"
                            checked={profileData.notifications}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                notifications: e.target.checked
                            }))}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <span>Dark Mode</span>
                    <label className="switch">
                        <input 
                            type="checkbox"
                            checked={profileData.darkMode}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                darkMode: e.target.checked
                            }))}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={onClose}>×</button>
                
                <div className="sidebar-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUser /> Profile
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <FaChartLine /> Analytics
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        <FaFileAlt /> Documents
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <FaBell /> Notifications
                        {notifications.some(n => !n.read) && <span className="notification-badge" />}
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <FaCog /> Settings
                    </button>
                </div>

                <div className="sidebar-content">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

export default Sidebar; 