import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCv, setHasCv] = useState(false);
  const [cvId, setCvId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const checkExistingCv = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/gestionnaire/cv/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.length > 0) {
          setHasCv(true);
          setCvId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error checking existing CV:', error);
      }
    };

    checkExistingCv();
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white bg-opacity-80 text-black shadow-md fixed top-0 left-0 w-full z-10">
      <h1 className="text-xl font-bold">CV Generator Dashboard</h1>
      <nav className="flex space-x-4">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>

        <Link to="/userdashboard" className="text-blue-500 hover:underline">
          My CV
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
