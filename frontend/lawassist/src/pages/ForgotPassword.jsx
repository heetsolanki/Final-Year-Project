import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ForgotPassword() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* LEFT SECTION */}
          <div className="auth-left bg-blue-900 transition-all duration-300">
            <h2 className="text-3xl font-semibold leading-snug mb-4">
              Forgot Your Password?
            </h2>
            <p className="text-gray-200">
              Enter your registered email address and we'll send you a password
              reset link.
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="auth-right">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-1">
              Reset Password
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
              We'll send a reset link to your email.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
              />

              <AuthButton text="Reset Password" />
              <p className="auth-switch">
                Remembered your password?
                <Link to="/login"> Login</Link>
              </p>
            </form>
          </div>
        </div>

        {/* POPUP MODAL */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <CheckCircle size={50} className="popup-icon" />

              <p className="popup-text">
                Password reset link sent successfully!
              </p>

              <button
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                onClick={handleClose}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;