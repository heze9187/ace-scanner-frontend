import React, { useState, useEffect } from 'react';
import api, { getCsrfToken, getCookie } from '../api/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfReady, setCsrfReady] = useState(false); // <--- NEW

  useEffect(() => {
    async function prepareCsrf() {
      console.log("[LoginForm] Fetching CSRF token...");
      await getCsrfToken();
      console.log("[LoginForm] Fetched CSRF token, ready!");
      setCsrfReady(true);
    }
    prepareCsrf();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!csrfReady) {
        throw new Error("CSRF not ready yet!");
      }
  
      await api.post("auth/login/", { username, password });
  
      onLoginSuccess();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={!csrfReady} // ✨ Disable button until CSRF cookie is ready
                >
                  {csrfReady ? "Login" : "Loading..."}
                </Button>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;