import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../../context/UserContext';

import './Register.css';


export default function Register() {
  const { user } = useContext(UserContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  const registerUser = (e) => {
    e.preventDefault();

    fetch('https://sw3285xufl.execute-api.us-west-2.amazonaws.com/production/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Registered successfully') {
          setFirstName('');
          setLastName('');
          setEmail('');
          setMobileNo('');
          setPassword(''); 
          Swal.fire({
            title: 'Registration Successful', 
            icon: 'success',
            text: 'Thank you for registering!',
          });
        } else {
          Swal.fire({
            title: 'Something went wrong.',
            icon: 'error',
            text: 'Please try again later or contact us for assistance',
          });
        }
      });
  };

  useEffect(() => {
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      mobileNo !== '' &&
      password !== ''
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password]);


  if (user && user.id !== null) {
    return <Navigate to="/products" />;  
  }
  

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-row">
          <div className="register-col">
            <div className="register-card">
              <h2>Register</h2>
              <Form onSubmit={registerUser}>
                <div className="register-form-group">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    placeholder="Enter first name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="register-form-group">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="text"
                    placeholder="Enter Last Name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="register-form-group">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="email"
                    placeholder="sample@mail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="register-form-group">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="number"
                    placeholder="09123456789"
                    required
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                  />
                </div>

                <div className="register-form-group">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="form-control"
                    type="password"
                    placeholder="Type your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button 
                  className="register-btn" 
                  type="submit" 
                  disabled={!isActive}
                >
                  Register
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
