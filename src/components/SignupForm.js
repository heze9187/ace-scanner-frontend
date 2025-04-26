import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('signup/', { username, password });
      alert('Signup successful! Please log in.');
      navigate('/login'); // Redirect to login after signup
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Username might already exist.');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2 className="text-center mb-4">Sign Up</h2>

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <div className="d-grid mb-3">
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </div>

      <div className="text-center">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Log in
        </span>
      </div>
    </Form>
  );
}

export default SignupForm;