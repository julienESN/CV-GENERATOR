// src/pages/CvPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import findBadWords from '../utils/findBadWords';

const CvPage = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [error, setError] = useState(''); 
  const [formError, setFormError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCvAndRecommendations = async () => {
      if (!token) {
        setError('Veuillez vous connecter pour voir ce CV.');
        return;
      }

      try {
        const [cvResponse, recResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/gestionnaire/cv/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/gestionnaire/cv/${id}/recommendations`
          ),
        ]);

        setCv(cvResponse.data);
        setRecommendations(recResponse.data);
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

    fetchCvAndRecommendations();
  }, [id, token]);

  const handleRecommendationChange = (e) => {
    const value = e.target.value;
    setNewRecommendation(value);

    // Vérification des banwords pendant la saisie
    const badWords = findBadWords(value);
    if (badWords.length > 0) {
      setFormError(
        `Votre recommandation contient des mots interdits : ${badWords.join(
          ', '
        )}`
      );
    } else {
      setFormError('');
    }
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Veuillez vous connecter pour laisser une recommandation.');
      return;
    }

    const badWords = findBadWords(newRecommendation);
    if (badWords.length > 0) {
      setFormError(
        `Votre recommandation contient des mots interdits : ${badWords.join(
          ', '
        )}`
      );
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/gestionnaire/cv/${id}/recommendations`,
        { content: newRecommendation },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/gestionnaire/cv/${id}/recommendations`
      );
      setRecommendations(recResponse.data);
      setNewRecommendation('');
      setFormError('');
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de la recommandation :",
        error.response || error
      );
      setFormError(
        `Impossible d'ajouter la recommandation : ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center bg-gray-50 p-8 min-h-screen w-full overflow-y-auto">
        <Header />
        <div className="p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex flex-col items-center bg-gray-50 p-8 min-h-screen w-full overflow-y-auto">
        <Header />
        <div className="p-6">
          <p>Chargement du CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-12 items-center bg-gray-50 p-8 min-h-screen w-full overflow-y-auto w-screen">
      <Header />
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* En-tête du CV */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">
            {cv.firstname} {cv.name}
          </h1>
          {/* Coordonnées */}
          <div className="mt-4 text-black">
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
              <p className="text-black">
                <strong>Site Web :</strong>{' '}
                <a href={cv.website} target="_blank" rel="noopener noreferrer">
                  {cv.website}
                </a>
              </p>
            )}
          </div>
          {cv.summary && <p className="text-black mt-4">{cv.summary}</p>}
        </div>

        {/* Section Compétences */}
        {cv.skills && cv.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
              Compétences
            </h2>
            <ul className="list-disc list-inside text-black">
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
            <ul className="list-disc list-inside text-black">
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
            <ul className="list-disc list-inside text-black">
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
          <ul className="list-disc list-inside text-black">
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
          <ul className="list-disc list-inside text-black">
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
              Centres d&lsquo;Intérêt
            </h2>
            <ul className="list-disc list-inside text-black">
              {cv.interests.map((interest, index) => (
                <li key={index} className="mb-2">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section Recommandations */}
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 mt-8">
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
          Recommandations
        </h2>

        {/* Affichage des erreurs du formulaire */}
        {formError && <p className="text-red-500 mb-4">{formError}</p>}

        {/* Formulaire pour ajouter une recommandation */}
        <form onSubmit={handleRecommendationSubmit} className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Laissez une recommandation..."
            value={newRecommendation}
            onChange={handleRecommendationChange}
            required
          ></textarea>
          <button
            type="submit"
            className={`mt-2 px-4 py-2 rounded ${
              formError || newRecommendation.trim() === ''
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={formError || newRecommendation.trim() === ''}
          >
            Soumettre
          </button>
        </form>

        {/* Affichage des recommandations */}
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="border-b pb-2 mb-2">
              <p className="font-semibold">{rec.userId.name}</p>
              <p>{rec.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(rec.date).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>Aucune recommandation pour ce CV.</p>
        )}
      </div>
    </div>
  );
};

export default CvPage;
