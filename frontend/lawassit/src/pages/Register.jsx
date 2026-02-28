import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, CheckCircle, XCircle, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

function Register() {
  const [role, setRole] = useState("consumer");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const passwordsMatch = form.password === form.confirmPassword;

  // ===== VALIDATIONS =====

  useEffect(() => {
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  }, [form.password, form.confirmPassword]);

  useEffect(() => {
    if (!showSuccess) return;

    if (countdown === 0) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showSuccess, countdown, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!form.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
      return;
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!valid) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }, [form.email]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[@$!%*?&]/.test(form.password),
  };
  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const formValid =
    form.fullName.trim() &&
    emailValid &&
    Object.values(passwordChecks).every(Boolean) &&
    passwordsMatch;

  const strengthPercent = (strengthScore / 5) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!emailValid) newErrors.email = "Enter a valid email address";

    if (!Object.values(passwordChecks).every(Boolean))
      newErrors.password = "Password does not meet all requirements";

    if (!passwordsMatch) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "https://lawassist-wgvq.onrender.com/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: form.fullName,
              email: form.email,
              password: form.password,
              role: role === "consumer" ? "consumer" : "legalExpert",
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setErrors({ email: data.message });
          return;
        }

        // Optional: Auto login after registration
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setShowSuccess(true);
        setCountdown(3);

        setForm({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

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

            <h2 className="auth-title">
              {role === "consumer"
                ? "Create Consumer Account"
                : "Join as Legal Expert"}
            </h2>

            <p className="auth-subtitle">
              {role === "consumer"
                ? "Register to get trusted legal support."
                : "Register to provide legal consultation services."}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                label="Full Name"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="Enter your full name"
              />

              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
              />

              <div className="password-wrapper">
                <AuthInput
                  label="Password"
                  placeholder={"Enter your password"}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                >
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </AuthInput>
              </div>
              {/* ===== PASSWORD CHECKLIST ===== */}
              {form.password && (
                <div className="password-checklist">
                  {Object.entries(passwordChecks)
                    .filter(([_, valid]) => !valid) // only invalid rules
                    .map(([key]) => (
                      <div key={key} className="check-item invalid">
                        <XCircle size={16} />
                        <span>
                          {key === "length" && "Minimum 8 characters"}
                          {key === "upper" && "At least one uppercase"}
                          {key === "lower" && "At least one lowercase"}
                          {key === "number" && "At least one number"}
                          {key === "special" &&
                            "At least one special character"}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              <AuthInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
              />
              <div className="strength-wrapper">
                <div
                  className="strength-bar"
                  style={{ width: `${strengthPercent}%` }}
                ></div>
              </div>

              <input type="hidden" value={role} name="role" />

              <AuthButton text="Create Account" disabled={!formValid} />

              <p className="auth-switch">
                Already have an account?
                <Link
                  to="/login"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  {" "}
                  Login
                </Link>
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
            {showSuccess && (
              <div className="popup-overlay">
                <div className="popup-card">
                  <CheckCircle size={50} className="popup-icon" />
                  <p className="popup-text">Registration Successful!</p>

                  <p className="redirect-text">Redirecting in {countdown}...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
