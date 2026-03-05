function AuthButton({ text, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`auth-btn ${disabled ? "auth-btn-disabled" : ""}`}
    >
      {text}
    </button>
  );
}

export default AuthButton;
