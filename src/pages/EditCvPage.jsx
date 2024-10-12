import { useState, useEffect } from 'react';
import axios from 'axios';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import { useNavigate, useParams } from 'react-router-dom';

const EditCvPage = () => {
  const [name, setName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [description, setDescription] = useState('');
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
        setDescription(userCv.description);
        setEducationalExperiences(userCv.educationalExperiences.join(','));
        setProfessionalExperiences(userCv.professionalExperiences.join(','));
        setVisibility(userCv.visibility);
      } catch (error) {
        console.error('Error fetching CV:', error);
        setError('Failed to load CV.');
      }
    };

    fetchCv();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to update your CV.');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/gestionnaire/cv/update/${id}`,
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
      setSuccess('CV updated successfully!');
      console.log('CV updated:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating CV:', error);
      setError('Failed to update CV. Please try again.');
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

  return (
    <div className="flex flex-col items-center bg-gray-50 p-8 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Edit your CV</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

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
          label="Update CV"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        />
      </form>
    </div>
  );
};

export default EditCvPage;
