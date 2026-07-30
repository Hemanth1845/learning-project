import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, API_URL, token, reloadProfile } = useContext(AuthContext);
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || '3rd Year');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science & Engineering');
  const [selectedCourse, setSelectedCourse] = useState(user?.selectedCourse || 'Full Stack Development');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Convert uploaded image to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          phoneNumber,
          selectedCourse,
          yearOfStudy,
          branch,
          profilePic
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Profile details successfully updated!');
        reloadProfile();
      } else {
        setError(data.message || 'Profile update failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>👤 Account Profile</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details, secure passwords, academic background, and active plan membership.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }} className="scorecard-panel">
        
        {/* User Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '32px 24px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
              alt="Profile Avatar" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--accent-primary)', objectFit: 'cover' }} 
            />
            <label style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--accent-gradient)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.9rem', color: 'white', border: '2px solid #232a3b' }}>
              📷
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            </label>
          </div>

          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'white' }}>{user?.username}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>

          <div style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-glass)', borderRadius: '20px', fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
            Active Plan: <span style={{ color: 'var(--accent-secondary)' }}>{user?.plan || 'Free Plan'}</span>
          </div>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', color: 'white' }}>
              <span style={{ color: 'var(--text-muted)' }}>📞 Phone: </span> {user?.phoneNumber || 'Not provided'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'white' }}>
              <span style={{ color: 'var(--text-muted)' }}>🎓 Academic Year: </span> {user?.yearOfStudy || 'Not provided'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'white' }}>
              <span style={{ color: 'var(--text-muted)' }}>🏢 Engineering Branch: </span> {user?.branch || 'Not provided'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'white' }}>
              <span style={{ color: 'var(--text-muted)' }}>📚 Chosen Track: </span> <strong style={{ color: 'var(--accent-secondary)' }}>{user?.selectedCourse || 'Not selected'}</strong>
            </div>
          </div>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>User Level</span>
              <strong style={{ fontSize: '1.15rem', color: 'white' }}>{Math.floor((user?.xp || 0) / 100) + 1}</strong>
            </div>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Vigor Streak</span>
              <strong style={{ fontSize: '1.15rem', color: 'white' }}>🔥 {user?.streak || 0} Days</strong>
            </div>
          </div>
        </div>

        {/* Edit profile form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '20px' }}>Modify Details</h3>
          
          <form onSubmit={handleUpdateProfile} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {msg && <div style={{ padding: '10px', background: 'rgba(46, 204, 113, 0.15)', color: 'var(--color-solved)', borderRadius: '6px', fontSize: '0.88rem' }}>{msg}</div>}
            {error && <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-hard)', borderRadius: '6px', fontSize: '0.88rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Full Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Contact Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <select 
                  className="form-input"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  required 
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Engineering Branch</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={branch} 
                  onChange={(e) => setBranch(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Target Course Track</label>
                <select 
                  className="form-input"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required 
                >
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Database Management">Database Management</option>
                  <option value="DSA & Algorithms">DSA & Algorithms</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Profile Image URL (Or Upload photo above)</label>
              <input 
                type="text" 
                className="form-input" 
                value={profilePic} 
                onChange={(e) => setProfilePic(e.target.value)} 
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)', margin: '8px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>New Password (Optional)</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Minimum 6 chars"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="primary-btn" style={{ padding: '10px 24px', alignSelf: 'flex-start' }}>
              {loading ? 'Updating Details...' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
