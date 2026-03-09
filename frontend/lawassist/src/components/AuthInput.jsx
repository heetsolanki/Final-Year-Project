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
  const blockAction = (e) => {
    e.preventDefault();
    alert("Copy-paste is disabled for password security.");
  };

  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="input-wrapper">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onCopy={blockAction}
          onPaste={blockAction}
          onCut={blockAction}
          onDragStart={blockAction}
          placeholder={placeholder}
        />
        {children}
      </div>

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export default AuthInput;
