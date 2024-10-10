import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './Hoc/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page principale (Login et Register) */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <header>
                <h1>Welcome to CV Generator</h1>
                <p>Create and manage your professional resume easily!</p>
              </header>
              <div className="auth-buttons">
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn-secondary">
                  Register
                </Link>
              </div>
            </div>
          }
        />

        {/* Route pour la page de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route pour la page d'inscription */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Route pour le Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
