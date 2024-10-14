import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateCvPage from './pages/CreateCvPage';
import EditCvPage from './pages/EditCvPage';
import ProtectedRoute from './Hoc/ProtectedRoute';
import CvPage from './pages/CvPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
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

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cv/edit/:id"
          element={
            <ProtectedRoute>
              <EditCvPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-cv"
          element={
            <ProtectedRoute>
              <CreateCvPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv/:id"
          element={
            <ProtectedRoute>
              <CvPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
