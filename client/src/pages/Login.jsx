import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(loginId);
      if (response.status === 200 && response.data.user) {
        const user = response.data.user;
        signIn(user);
        navigate('/dashboard',
          {
            state:
            {
              user_id: user.user_id,
              user_name: user.user_name
            }
          });
      } else {
        setError(response.data.error || "Login Failed");
      }
    }
    catch (err) {
      if (err.response) {
        setError(`${err.response.status}:${err.response.data.error}`);
      }
      else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Login ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
          style={{ width: '100%', padding: 8 }}
        />
        <button type="submit" style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          marginTop: 10
        }}>Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
