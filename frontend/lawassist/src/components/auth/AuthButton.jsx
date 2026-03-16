function AuthButton({
  text,
  disabled,
  type = "submit",
  isLoading = false,
  loadingText = "Please wait...",
}) {
  const buttonText = isLoading ? loadingText : text;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`auth-btn ${disabled || isLoading ? "auth-btn-disabled" : ""}`}
    >
      {buttonText}
    </button>
  );
}

export default AuthButton;
