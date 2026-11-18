import '../../styles/atoms/Boton.css'

function Button({ children, onClick, type = "button", className = "", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`atom-button ${className}`.trim()}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
