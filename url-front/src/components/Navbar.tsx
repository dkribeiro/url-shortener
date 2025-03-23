import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export function Navbar() {
  const { userId, setUserId } = useUser();
  const [inputUserId, setInputUserId] = useState('');

  const handleLogin = () => {
    if (inputUserId.trim()) {
      setUserId(inputUserId.trim());
      setInputUserId('');
    }
  };

  const handleLogout = () => {
    setUserId(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-2 mb-4">
      <div className="container">
        <Link className="navbar-brand py-0" to="/">
          URL Shortener
        </Link>

        <div className="d-flex align-items-center gap-2">
          {userId ? (
            <>
              <Link to="/my-urls" className="btn btn-outline-light btn-sm">
                My URLs
              </Link>
              <div className="text-light me-2">Logged as: {userId}</div>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="d-flex gap-2 align-items-center">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Enter user ID"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{ width: '150px' }}
              />
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogin}
              >
                Set User ID
              </button>
              <small className="text-light ms-2">
                * User ID is used to simulate a user session
              </small>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 