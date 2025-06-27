import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { Notyf } from 'notyf';
import './Login.css';

export default function Login() {
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  function authenticate(e) {
    e.preventDefault();
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access !== undefined) {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);
          setEmail('');
          setPassword('');
          notyf.success('User logged in successfully');
        } else if (data.message === 'Email and password do not match') {
          notyf.error('Incorrect Credentials. Try Again');
        } else {
          notyf.error('User Not Found. Try Again.');
        }
      })
      .catch(error => {
        notyf.error('Network Error. Please try again.');
      });
  }

  function retrieveUserDetails(token) {
    fetch('https://dpgijq59ve.execute-api.us-west-2.amazonaws.com/production/users/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser({ id: data._id, isAdmin: data.isAdmin });
      });
  }

  useEffect(() => {
    setIsActive(email !== '' && password !== '');
  }, [email, password]);

  // If user is logged in, navigate to /products
  if (user?.id) return <Navigate to="/" />;

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>
        <Form onSubmit={authenticate}>
          <div className="login-form-group">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="form-control"
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="login-form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="form-control"
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="login-grid">
            <Button className="login-btn" type="submit" disabled={!(email && password)}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}