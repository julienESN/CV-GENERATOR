import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const CvPage = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCv = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour voir ce CV.');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/gestionnaire/cv/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCv(response.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération du CV :',
          error.response || error
        );
        setError(
          `Impossible de charger le CV : ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchCv();
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center bg-gray-50 p-8 h-screen w-full overflow-y-auto">
        <Header />
        <div className="p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex flex-col  items-center bg-gray-50 p-8 h-screen w-full overflow-y-auto">
        <Header />
        <div className="p-6">
          <p>Chargement du CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-12 items-center bg-gray-50 p-8 h-screen w-full overflow-y-auto">
      <Header />
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* En-tête du CV */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            {cv.firstname} {cv.name}
          </h1>
          {/* Coordonnées */}
          <div className="mt-4">
            {cv.email && (
              <p>
                <strong>Email :</strong> {cv.email}
              </p>
            )}
            {cv.phone && (
              <p>
                <strong>Téléphone :</strong> {cv.phone}
              </p>
            )}
            {cv.address && (
              <p>
                <strong>Adresse :</strong> {cv.address}
              </p>
            )}
            {cv.website && (
              <p>
                <strong>Site Web :</strong>{' '}
                <a href={cv.website} target="_blank" rel="noopener noreferrer">
                  {cv.website}
                </a>
              </p>
            )}
          </div>
          {cv.summary && <p className="text-gray-600 mt-4">{cv.summary}</p>}
        </div>

        {/* Section Compétences */}
        {cv.skills && cv.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
              Compétences
            </h2>
            <ul className="list-disc list-inside">
              {cv.skills.map((skill, index) => (
                <li key={index} className="mb-2">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Langues */}
        {cv.languages && cv.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
              Langues
            </h2>
            <ul className="list-disc list-inside">
              {cv.languages.map((language, index) => (
                <li key={index} className="mb-2">
                  {language}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Certifications */}
        {cv.certifications && cv.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
              Certifications
            </h2>
            <ul className="list-disc list-inside">
              {cv.certifications.map((certification, index) => (
                <li key={index} className="mb-2">
                  {certification}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Expériences Professionnelles */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
            Expériences Professionnelles
          </h2>
          <ul className="list-disc list-inside">
            {cv.professionalExperiences.map((experience, index) => (
              <li key={index} className="mb-2">
                {experience}
              </li>
            ))}
          </ul>
        </div>

        {/* Section Expériences Éducatives */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
            Expériences Éducatives
          </h2>
          <ul className="list-disc list-inside">
            {cv.educationalExperiences.map((experience, index) => (
              <li key={index} className="mb-2">
                {experience}
              </li>
            ))}
          </ul>
        </div>

        {/* Section Centres d'Intérêt */}
        {cv.interests && cv.interests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
              Centres d'Intérêt
            </h2>
            <ul className="list-disc list-inside">
              {cv.interests.map((interest, index) => (
                <li key={index} className="mb-2">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvPage;
