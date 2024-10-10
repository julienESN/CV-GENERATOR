import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white text-black shadow-md fixed top-0 left-0 w-full z-10">
      <h1 className="text-xl font-bold">CV Generator Dashboard</h1>
      <nav>
        <Link to="/dashboard" className="mr-4 text-blue-500 hover:underline">
          Dashboard
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
