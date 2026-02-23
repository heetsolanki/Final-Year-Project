import { useState } from "react";
import { Scale, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

function Register() {
  const [role, setRole] = useState("consumer");

  const consumerPoints = [
    "Access verified consumer rights guidance.",
    "Track and manage your legal queries.",
    "Connect with trusted legal professionals.",
    "Stay updated with consumer law resources.",
  ];

  const expertPoints = [
    "Expand your professional visibility.",
    "Receive verified legal consultation requests.",
    "Build credibility through verified profile.",
    "Manage client queries efficiently.",
  ];

  return (
    <>
      <Navbar />
      <div className="auth-wrapper pt-32">
        <div className="auth-container">
          {/* LEFT SECTION — FORM */}
          <div className="auth-right">
            {/* ROLE SWITCH */}
            <div className="role-switch">
              <button
                className={`role-btn ${role === "consumer" ? "active-role" : ""}`}
                onClick={() => setRole("consumer")}
                type="button"
              >
                Consumer
              </button>

              <button
                className={`role-btn ${role === "expert" ? "active-role" : ""}`}
                onClick={() => setRole("expert")}
                type="button"
              >
                Legal Expert
              </button>
            </div>

            <h2 className="form-title">
              {role === "consumer"
                ? "Create Consumer Account"
                : "Join as Legal Expert"}
            </h2>

            <p className="form-subtitle">
              {role === "consumer"
                ? "Register to get trusted legal support."
                : "Register to provide legal consultation services."}
            </p>

            <form className="auth-form">
              <AuthInput
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />

              <AuthInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
              />

              <AuthInput
                label="Password"
                type="password"
                placeholder="Create your password"
              />

              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
              />

              {/* Hidden role field (important for backend later) */}
              <input type="hidden" value={role} name="role" />

              <AuthButton text="Create Account" />

              <p className="auth-switch">
                Already have an account?
                <Link to="/login"> Login</Link>
              </p>
            </form>
          </div>

          {/* RIGHT SECTION — DYNAMIC BENEFITS */}
          <div
            className={`auth-left ${
              role === "consumer" ? "consumer-bg" : "expert-bg"
            }`}
          >
            <div className="auth-brand">
              <Scale size={32} className="brand-icon" />
              <h1>
                {role === "consumer"
                  ? "Why Join LawAssist?"
                  : "Why Become a LawAssist Expert?"}
              </h1>
            </div>

            <div className="space-y-5 mt-6">
              {(role === "consumer" ? consumerPoints : expertPoints).map(
                (point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-yellow-400 mt-1" />
                    <p>{point}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
