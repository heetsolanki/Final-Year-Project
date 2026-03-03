const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-box animate-fadeIn text-center">
        <div className="text-4xl mb-4 text-green-500">✓</div>

        <h3 className="text-lg font-semibold text-gray-800">Success</h3>

        <p className="text-gray-500 mt-2 text-center">{message}</p>

        <button onClick={onClose} className="profile-btn mt-6 w-full">
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
