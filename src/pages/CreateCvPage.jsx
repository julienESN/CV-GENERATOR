import { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useNavigate } from 'react-router-dom';

const CreateCvPage = () => {
  const [name, setName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [description, setDescription] = useState('');
  const [educationalExperiences, setEducationalExperiences] = useState('');
  const [professionalExperiences, setProfessionalExperiences] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [error, setError] = useState('');
  const [hasCv, setHasCv] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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
        }
      } catch (error) {
        console.error('Error checking existing CV:', error);
        setError('Failed to check existing CV.');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingCv();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !name ||
      !firstname ||
      !description ||
      !educationalExperiences ||
      !professionalExperiences
    ) {
      setError('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a CV.');
      return;
    }

    if (hasCv) {
      setError('You can only create one CV, but you can modify it.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/gestionnaire/cv/create`,
        {
          name,
          firstname,
          description,
          educationalExperiences: educationalExperiences.split(','),
          professionalExperiences: professionalExperiences.split(','),
          visibility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('CV created:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating CV:', error);
      setError('Failed to create CV. Please try again.');
    }
  };

  const fields = [
    {
      label: 'Name',
      type: 'text',
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      label: 'First Name',
      type: 'text',
      value: firstname,
      onChange: (e) => setFirstName(e.target.value),
    },
    {
      label: 'Description',
      type: 'text',
      value: description,
      onChange: (e) => setDescription(e.target.value),
    },
    {
      label: 'Educational Experiences (comma-separated)',
      type: 'text',
      value: educationalExperiences,
      onChange: (e) => setEducationalExperiences(e.target.value),
    },
    {
      label: 'Professional Experiences (comma-separated)',
      type: 'text',
      value: professionalExperiences,
      onChange: (e) => setProfessionalExperiences(e.target.value),
    },
  ];

  if (isLoading) {
    return <p className="text-gray-600">Checking existing CV...</p>;
  }

  // Affichage si l'utilisateur a déjà un CV
  if (hasCv) {
    return (
      <div className="flex flex-col items-center bg-gray-50 p-8 min-h-screen w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">
          You already have a CV
        </h1>
        <p className="text-gray-600 mb-6">
          You can only create one CV, but you can modify it in your dashboard.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 p-8 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Create a CV</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <p className="text-gray-600 mb-6">
        You can only create one CV, but you will be able to modify it after
        creation.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"
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
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value === 'true')}
            className="border rounded-md w-full p-2 bg-white"
          >
            <option value="false">Private</option>
            <option value="true">Public</option>
          </select>
        </div>

        <SubmitButton
          label="Create CV"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        />
      </form>
    </div>
  );
};

export default CreateCvPage;
