function AuthButton({ text, disabled, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`auth-btn ${disabled ? "auth-btn-disabled" : ""}`}
    >
      {text}
    </button>
  );
}

export default AuthButton;
