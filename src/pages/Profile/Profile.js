import { useEffect, useState, useContext } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../../context/UserContext';
import './Profile.css'; // Import the CSS file for custom styles

const notyf = new Notyf({
  duration: 2000,
  position: { x: 'right', y: 'bottom' }
});

export default function Profile() {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/users/details', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          notyf.error(data.error);
        } else {
          setUserData(data);
        }
      })
      .catch(err => {
        console.error('❌ Error fetching user details:', err);
        notyf.error('Failed to load user info');
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/users/update-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newPassword })
      });

      const result = await res.json();

      if (res.ok) {
        notyf.success('Password updated successfully');
        setNewPassword('');
      } else {
        notyf.error(result.message || result.error || 'Failed to update password');
      }
    } catch (err) {
      console.error('❌ Password update error:', err);
      notyf.error('Password update failed');
    }
  };

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <div className="profile-name">
          {userData.firstName} {userData.lastName}
        </div>
        <div className="profile-email">{userData.email}</div>
        <ul className="profile-info-list">
          <li className="profile-info-item">
            <span>Role:</span>
            <span>{userData.isAdmin ? "Admin" : "User"}</span>
          </li>
        </ul>
        <form onSubmit={handlePasswordChange} style={{ width: "100%" }}>
          <h5 style={{ marginTop: 5, marginBottom: 12,  }}>Change Password</h5>
          <div className="mb-3">
            <label htmlFor="newPassword" className="contact-label">
              New Password
            </label>
            <input
              id="newPassword"
              className="contact-input"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <button className="profile-edit-btn" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}