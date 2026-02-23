import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

function Login() {
  return (
    <>
        <Navbar />
    <div className="auth-wrapper">
      <div className="auth-container">

        {/* LEFT SECTION */}
        <div className="auth-left">
          <div className="auth-brand">
            <Scale size={32} className="brand-icon" />
            <h1>LawAssist</h1>
          </div>

          <h2 className="auth-heading">
            Empowering Consumer Rights with Smart Legal Support
          </h2>

          <p className="auth-description">
            Access your dashboard, manage legal queries,
            and connect with verified legal professionals.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="auth-right">

          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Please login to your account</p>

          <form className="auth-form">

            <AuthInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <div className="auth-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </div>

            <AuthButton text="Login" />

            <p className="auth-switch">
              Don’t have an account?
              <Link to="/register" className="auth-link">
                Create Account
              </Link>
            </p>

          </form>

        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Login;