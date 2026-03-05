import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

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
          <div className="auth-left consumer-bg">
            <h2 className="auth-heading">Forgot Your Password?</h2>
            <p className="auth-description">
              Enter your registered email address and we’ll send you a password
              reset link.
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="auth-right">
            <h2 className="form-title">Reset Password</h2>
            <p className="form-subtitle">
              We’ll send a reset link to your email.
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

              <button className="popup-btn" onClick={handleClose}>
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
