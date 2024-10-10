import PropTypes from 'prop-types';

const SubmitButton = ({ label }) => {
  return (
    <button
      type="submit"
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-64"
    >
      {label}
    </button>
  );
};

SubmitButton.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SubmitButton;
