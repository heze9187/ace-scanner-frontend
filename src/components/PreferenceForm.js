import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/api";
import { getCsrfToken } from "../api/api"; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function PreferenceForm({ onSaveSuccess }) {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [weekdayStart, setWeekdayStart] = useState(1700);
  const [weekdayEnd, setWeekdayEnd] = useState(2400);
  const [weekendStart, setWeekendStart] = useState(900);
  const [weekendEnd, setWeekendEnd] = useState(2400);

  useEffect(() => {
    async function fetchCourts() {
      try {
        const response = await api.get("courts/");
        setCourts(response.data.results);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    }
    fetchCourts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await getCsrfToken();  // Fetch CSRF cookie first
  
      await api.post("preferences/", {
        court_id: selectedCourt,
        weekday_start: weekdayStart,
        weekday_end: weekdayEnd,
        weekend_start: weekendStart,
        weekend_end: weekendEnd,
        receive_email: true,
      });
  
      onSaveSuccess();
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving preference:", error);
      alert("Save failed! Check login or CSRF.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Set Your Tennis Preference 🎾</h2>
              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="courtSelect">
                  <Form.Label>Select Court</Form.Label>
                  <Form.Select 
                    value={selectedCourt}
                    onChange={(e) => setSelectedCourt(e.target.value)}
                    required
                  >
                    <option value="">-- Select a Court --</option>
                    {courts.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="weekdayStart">
                  <Form.Label>Weekday Start Time (e.g. 1700)</Form.Label>
                  <Form.Control
                    type="number"
                    value={weekdayStart}
                    onChange={(e) => setWeekdayStart(Number(e.target.value))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="weekdayEnd">
                  <Form.Label>Weekday End Time</Form.Label>
                  <Form.Control
                    type="number"
                    value={weekdayEnd}
                    onChange={(e) => setWeekdayEnd(Number(e.target.value))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="weekendStart">
                  <Form.Label>Weekend Start Time</Form.Label>
                  <Form.Control
                    type="number"
                    value={weekendStart}
                    onChange={(e) => setWeekendStart(Number(e.target.value))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="weekendEnd">
                  <Form.Label>Weekend End Time</Form.Label>
                  <Form.Control
                    type="number"
                    value={weekendEnd}
                    onChange={(e) => setWeekendEnd(Number(e.target.value))}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Save Preferences
                </Button>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PreferenceForm;