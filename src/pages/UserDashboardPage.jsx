import {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Header from '../components/Header';

const UserDashboardPage = () => {
    const [Cvs, setCvs] = useState([]);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCvs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/gestionnaire/cv/user`,
                    {
                        params: {
                            search: searchQuery,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCvs(response.data);

            } catch (error) {
                console.error('Error fetching CVs:', error.response || error);
                setError(
                    `Failed to load CVs: ${error.response?.data?.message || error.message}`
                );
            }
        };

        fetchCvs();
    }, [searchQuery]);


    const handleDelete = async (event, id) => {
        event.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/gestionnaire/cv/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete CV: ${errorMessage}`);
            }

            // Retirer le CV de l'état local après la suppression
            setCvs(prevCvs => prevCvs.filter(cv => cv._id !== id));

        } catch (error) {
            console.error('Error deleting CV:', error);
        }
    };

    return (
        <div>
            <Header/>
            <div className="p-6 mt-20">
                <h1 className="text-2xl font-bold">Bienvenue sur votre Tableau de Bord !</h1>
                <p>Cette page est protégée. Vous êtes connecté.</p>

                {error && <p className="text-red-500">{error}</p>}

                <div className="mt-6">
                    <input
                        type="text"
                        placeholder="Rechercher un CV..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                    />

                    {Array.isArray(Cvs) && Cvs.length === 0 ? (
                        <p>Aucun CV disponible pour le moment.</p>
                    ) : (
                        Array.isArray(Cvs) && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
                                {Cvs.map((cv) => (
                                    <div key={cv._id}
                                         className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 p-4">
                                        <Link to={`/cv/${cv._id}`}>
                                            <h3 className="text-xl font-semibold text-gray-800">{cv.name} {cv.firstname}</h3>
                                            <p className="text-gray-600 mt-1"><strong>Description
                                                :</strong> {cv.description}</p>
                                            <p className="text-gray-600"><strong>Expériences Éducatives
                                                :</strong> {cv.educationalExperiences.join(', ')}</p>
                                            <p className="text-gray-600"><strong>Expériences Professionnelles
                                                :</strong> {cv.professionalExperiences.join(', ')}</p>
                                        </Link>
                                        <div className="flex space-x-2 mt-4">
                                            <Link to={`/cv/edit/${cv._id}`}>
                                                <button
                                                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-200">
                                                    <FontAwesomeIcon icon={faPen}/>
                                                </button>
                                            </Link>
                                            <button
                                                onClick={(event) => handleDelete(event, cv._id)}
                                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
                                            >
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )
                    )}
                </div>

                {/* Section pour ajouter un CV */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
                    <Link
                        to={`/create-cv`}
                        className="border p-4 rounded shadow-lg hover:bg-gray-100 flex flex-col items-center justify-center text-gray-600 border-2 border-gray-300"
                        style={{minHeight: '200px'}} // Ajuste la hauteur minimale pour correspondre aux autres
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-gray-600 w-10 h-10 mb-2"/>
                        <p className="text-center font-bold">Créer votre CV !</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
