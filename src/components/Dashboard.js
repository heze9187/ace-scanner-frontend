import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getCsrfToken } from "../api/api";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner"; // ADD Spinner for loading effect

function Dashboard({ handleLogout }) {
  const [courts, setCourts] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [scraping, setScraping] = useState(false); // NEW state
  const navigate = useNavigate();

  const getGroupedMatchedAvailabilities = () => {
    const grouped = {};
  
    availabilities.forEach((availability) => {
      const availabilityDate = new Date(availability.date);
      const dayOfWeek = availabilityDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
      const militaryTime = parseInt(
        availability.time.replace(':', '').replace('AM', '').replace('PM', '')
      ); // quick naive parse for now
  
      preferences.forEach((pref) => {
        if (availability.court_name === pref.court.name) {
          if (isWeekend) {
            if (militaryTime >= pref.weekend_start && militaryTime <= pref.weekend_end) {
              if (!grouped[availability.court_name]) {
                grouped[availability.court_name] = [];
              }
              grouped[availability.court_name].push(availability);
            }
          } else {
            if (militaryTime >= pref.weekday_start && militaryTime <= pref.weekday_end) {
              if (!grouped[availability.court_name]) {
                grouped[availability.court_name] = [];
              }
              grouped[availability.court_name].push(availability);
            }
          }
        }
      });
    });
  
    return grouped;
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await api.get("availabilities/");
      setAvailabilities(response.data.results);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const fetchCourts = async () => {
    try {
      const response = await api.get("courts/");
      setCourts(response.data.results);
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await api.get("preferences/");
      setPreferences(response.data.results);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const handleDeletePreference = async (id) => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      await api.delete(`preferences/${id}/`, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      fetchPreferences(); // Refresh after delete
    } catch (error) {
      console.error("Error deleting preference:", error);
      alert("Failed to delete preference.");
    }
  };

  const runScrape = async () => {
    try {
      setScraping(true);

      await getCsrfToken();
      
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      await api.post('scrape/', {}, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });

      await fetchAvailabilities();
    } catch (error) {
      console.error('Error running scrape:', error);
      alert('Failed to run scrape.');
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchCourts();
    fetchPreferences();
    fetchAvailabilities();
  }, []);

  return (
    <Container className="mt-5">
      <Row className="mb-4 text-center">
        <Col>
          <h1>NYC Park Tennis Courts Dashboard 🎾</h1>
          <Button variant="primary" className="me-2" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            variant="success"
            className="me-2"
            onClick={() => navigate("/preferences/new")}
          >
            Set Preferences
          </Button>
          <Button 
            variant="warning" 
            onClick={runScrape} 
            disabled={scraping}
          >
            {scraping ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Checking...
              </>
            ) : (
              "Check Availability Now"
            )}
          </Button>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2>Courts</h2>
          <ListGroup>
            {courts.map((court) => (
              <ListGroup.Item key={court.id}>{court.name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Your Saved Preferences</h2>
          {preferences.length === 0 ? (
            <p className="text-muted">No preferences saved yet.</p>
          ) : (
            <ListGroup>
              {preferences.map((pref) => (
                <ListGroup.Item
                  key={pref.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <p>
                      <strong>Court:</strong> {pref.court.name}
                    </p>
                    <p>
                      <strong>Weekdays:</strong> {pref.weekday_start}-{pref.weekday_end}
                    </p>
                    <p>
                      <strong>Weekends:</strong> {pref.weekend_start}-{pref.weekend_end}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePreference(pref.id)}
                  >
                    Delete
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      <Row>
  <Col>
    <h2>Matched Available Courts 🎯</h2>
    {Object.keys(getGroupedMatchedAvailabilities()).length === 0 ? (
      <p className="text-muted">No matches found for your preferences.</p>
    ) : (
      Object.entries(getGroupedMatchedAvailabilities()).map(([courtName, slots]) => (
        <div key={courtName} className="mb-4">
          <h5 className="mt-3">{courtName}</h5>
          <ListGroup>
            {slots.map((slot, idx) => (
              <ListGroup.Item key={idx}>
                {slot.date} at {slot.time}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))
    )}
  </Col>
</Row>
    </Container>
  );
}

export default Dashboard;