function AuthInput({ label, type, placeholder }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} />
    </div>
  );
}

export default AuthInput;