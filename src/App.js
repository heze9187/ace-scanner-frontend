import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import api from "./api/api";
import { getCsrfToken } from "./api/api";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import PreferenceForm from "./components/PreferenceForm";
import SignupForm from "./components/SignupForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // <-- NEW loading state
  const [preferences, setPreferences] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setPreferences([]); // <--- Reset saved preferences
    setAvailabilities([]); // <--- Reset available courts (optional)
  };

  const handleLogout = async () => {
    await getCsrfToken();
    await api.post("auth/logout/");
    setIsAuthenticated(false);
  };

  // Wrapper for PreferenceForm because it uses useNavigate
  function PreferenceFormWrapper() {
    const navigate = useNavigate();

    return <PreferenceForm onSaveSuccess={() => navigate("/dashboard")} />;
  }

  // Check if user is already logged in on page load
  const checkAuthentication = async () => {
    try {
      const response = await api.get("whoami/");
      if (response.data.is_authenticated) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // ✅ Show simple loading while checking
  }

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route
              path="/login"
              element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="*" element={<Navigate to="/signup" />} />
          </>
        ) : (
          <>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  handleLogout={handleLogout}
                  preferences={preferences}
                  setPreferences={setPreferences}
                  availabilities={availabilities}
                  setAvailabilities={setAvailabilities}
                />
              }
            />
            <Route
              path="/preferences/new"
              element={<PreferenceFormWrapper />}
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
