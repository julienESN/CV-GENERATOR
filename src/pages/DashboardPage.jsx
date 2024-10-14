import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const DashboardPage = () => {
  const [publicCvs, setPublicCvs] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPublicCvs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/gestionnaire/cv/public`,
          {
            params: {
              search: searchQuery, // Inclure le paramètre de recherche
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPublicCvs(response.data);
      } catch (error) {
        console.error('Error fetching public CVs:', error.response || error);
        setError(
          `Failed to load public CVs: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchPublicCvs();
  }, [searchQuery]); // Recharger les CV à chaque changement de searchQuery

  return (
    <div>
      <Header />
      <div className="p-6 mt-20">
        <h1 className="text-2xl font-bold">
          Bienvenue sur votre Tableau de Bord !
        </h1>
        <p>Cette page est protégée. Vous êtes connecté.</p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mt-6">
          <h2 className="text-xl font-semibold">CV Publics</h2>

          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher un CV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          {publicCvs.length === 0 ? (
            <p>Aucun CV public disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
              {publicCvs.map((cv) => (
                <Link
                  to={`/cv/${cv._id}`}
                  key={cv._id}
                  className="border p-4 rounded shadow-lg hover:bg-gray-100"
                >
                  <h3 className="text-lg font-bold">
                    {cv.name} {cv.firstname}
                  </h3>
                  <p>
                    <strong>Description :</strong> {cv.description}
                  </p>
                  <p>
                    <strong>Expériences Éducatives :</strong>{' '}
                    {cv.educationalExperiences.join(', ')}
                  </p>
                  <p>
                    <strong>Expériences Professionnelles :</strong>{' '}
                    {cv.professionalExperiences.join(', ')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
