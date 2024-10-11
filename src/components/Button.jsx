
import PropTypes from 'prop-types';

const Button = ({ children, type }) => {
  return (
    <button
      type={type}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
};

export default Button;
