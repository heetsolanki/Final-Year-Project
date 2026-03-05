function AuthInput({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
  children,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="input-wrapper">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {children}
      </div>

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export default AuthInput;
