import PropTypes from 'prop-types';

const InputField = ({ label, type, value, onChange }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-gray-700 mb-2">{label}:</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputField;
