import { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useNavigate, useParams, Link } from 'react-router-dom';
import findBadWords from '../utils/findBadWords';

const EditCvPage = () => {
  const [name, setName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [certifications, setCertifications] = useState('');
  const [interests, setInterests] = useState('');
  const [educationalExperiences, setEducationalExperiences] = useState('');
  const [professionalExperiences, setProfessionalExperiences] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCv = async () => {
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

        const userCv = response.data[0];

        setName(userCv.name);
        setFirstName(userCv.firstname);
        setEmail(userCv.email);
        setPhone(userCv.phone);
        setAddress(userCv.address);
        setWebsite(userCv.website);
        setSummary(userCv.summary);
        setDescription(userCv.description);
        setSkills(userCv.skills.join(','));
        setLanguages(userCv.languages.join(','));
        setCertifications(userCv.certifications.join(','));
        setInterests(userCv.interests.join(','));
        setEducationalExperiences(userCv.educationalExperiences.join(','));
        setProfessionalExperiences(userCv.professionalExperiences.join(','));
        setVisibility(userCv.visibility);
      } catch (error) {
        console.error('Erreur lors de la récupération du CV :', error);
        setError('Échec du chargement du CV.');
      }
    };

    fetchCv();
  }, [id]);

  // Gestionnaire générique pour les entrées avec vérification des mots interdits
  const handleInputChange = (fieldSetter, fieldLabel) => (e) => {
    const value = e.target.value;
    const badWords = findBadWords(value);
    if (badWords.length > 0) {
      setError(
        `Le champ "${fieldLabel}" contient des mots interdits : ${badWords.join(
          ', '
        )}`
      );
    } else {
      setError('');
    }
    fieldSetter(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Vérifier tous les champs pour les mots interdits
    const fieldsToCheck = {
      Nom: name,
      Prénom: firstname,
      Email: email,
      Téléphone: phone,
      Adresse: address,
      SiteWeb: website,
      Résumé: summary,
      Description: description,
      Compétences: skills,
      Langues: languages,
      Certifications: certifications,
      Intérêts: interests,
      'Expériences Éducatives': educationalExperiences,
      'Expériences Professionnelles': professionalExperiences,
    };

    for (const [fieldLabel, fieldValue] of Object.entries(fieldsToCheck)) {
      const badWords = findBadWords(fieldValue.toString());
      if (badWords.length > 0) {
        setError(
          `Le champ "${fieldLabel}" contient des mots interdits : ${badWords.join(
            ', '
          )}`
        );
        return; // Empêche la soumission si un mot interdit est trouvé
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour mettre à jour votre CV.');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/gestionnaire/cv/update/${id}`,
        {
          name,
          firstname,
          email,
          phone,
          address,
          website,
          summary,
          description,
          skills: skills.split(',').map((skill) => skill.trim()),
          languages: languages.split(',').map((lang) => lang.trim()),
          certifications: certifications.split(',').map((cert) => cert.trim()),
          interests: interests.split(',').map((interest) => interest.trim()),
          educationalExperiences: educationalExperiences
            .split(',')
            .map((edu) => edu.trim()),
          professionalExperiences: professionalExperiences
            .split(',')
            .map((pro) => pro.trim()),
          visibility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('CV mis à jour avec succès !');
      console.log('CV mis à jour :', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du CV :', error);
      setError('Échec de la mise à jour du CV. Veuillez réessayer.');
    }
  };

  const fields = [
    {
      label: 'Nom',
      type: 'text',
      value: name,
      onChange: handleInputChange(setName, 'Nom'),
    },
    {
      label: 'Prénom',
      type: 'text',
      value: firstname,
      onChange: handleInputChange(setFirstName, 'Prénom'),
    },
    {
      label: 'Email',
      type: 'email',
      value: email,
      onChange: handleInputChange(setEmail, 'Email'),
    },
    {
      label: 'Numéro de Téléphone',
      type: 'text',
      value: phone,
      onChange: handleInputChange(setPhone, 'Numéro de Téléphone'),
    },
    {
      label: 'Adresse',
      type: 'text',
      value: address,
      onChange: handleInputChange(setAddress, 'Adresse'),
    },
    {
      label: 'Site Web ou Portfolio',
      type: 'text',
      value: website,
      onChange: handleInputChange(setWebsite, 'Site Web ou Portfolio'),
    },
    {
      label: 'Résumé Professionnel',
      type: 'textarea',
      value: summary,
      onChange: handleInputChange(setSummary, 'Résumé Professionnel'),
    },
    {
      label: 'Description',
      type: 'text',
      value: description,
      onChange: handleInputChange(setDescription, 'Description'),
    },
    {
      label: 'Compétences (séparées par des virgules)',
      type: 'text',
      value: skills,
      onChange: handleInputChange(setSkills, 'Compétences'),
    },
    {
      label: 'Langues (séparées par des virgules)',
      type: 'text',
      value: languages,
      onChange: handleInputChange(setLanguages, 'Langues'),
    },
    {
      label: 'Certifications (séparées par des virgules)',
      type: 'text',
      value: certifications,
      onChange: handleInputChange(setCertifications, 'Certifications'),
    },
    {
      label: "Centres d'Intérêt (séparés par des virgules)",
      type: 'text',
      value: interests,
      onChange: handleInputChange(setInterests, "Centres d'Intérêt"),
    },
    {
      label: 'Expériences Éducatives (séparées par des virgules)',
      type: 'text',
      value: educationalExperiences,
      onChange: handleInputChange(
        setEducationalExperiences,
        'Expériences Éducatives'
      ),
    },
    {
      label: 'Expériences Professionnelles (séparées par des virgules)',
      type: 'text',
      value: professionalExperiences,
      onChange: handleInputChange(
        setProfessionalExperiences,
        'Expériences Professionnelles'
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center bg-gray-50 p-8 h-screen w-full overflow-y-auto">
      <div className="flex items-center mb-6">
        {/* Ajout de la flèche */}
        <Link to="/dashboard" className="mr-4 text-blue-500">
          ← Retour au dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-700">Modifier votre CV</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg max-h-full overflow-y-auto"
      >
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <InputField
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={field.onChange}
              className="border rounded-md w-full p-2"
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibilité
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value === 'true')}
            className="border rounded-md w-full p-2 bg-white"
          >
            <option value="false">Privé</option>
            <option value="true">Public</option>
          </select>
        </div>

        <SubmitButton
          label="Mettre à jour le CV"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        />
      </form>
    </div>
  );
};

export default EditCvPage;
