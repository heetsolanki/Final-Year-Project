import { useState, useEffect } from "react";
import API_URL from "../api";
import { useNavigate } from "react-router-dom";
import { Scale, CheckCircle, XCircle, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertPopup from "../components/AlertPopup";
import { consumerPoints, expertPoints } from "../data";

// const API = "https://law-assist.onrender.com/api";

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
        const response = await fetch(`${API_URL}/api/auth/register`, {
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
        });

        const data = await response.json();
        console.log("Register API Response:", data);

        if (!response.ok) {
          setErrors({ email: data.message });
          return;
        }

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setCountdown(3);
        setShowSuccess(true);

        let counter = 3;

        const interval = setInterval(() => {
          counter -= 1;
          setCountdown(counter);

          if (counter === 0) {
            clearInterval(interval);

            if (data.role === "legalExpert") {
              navigate("/legal-expert-dashboard");
            } else {
              navigate("/user-dashboard");
            }
          }
        }, 1000);

        setForm({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* LEFT SECTION — FORM */}
          <div className="auth-right">
            {/* ROLE SWITCH */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                  role === "consumer" ? "bg-blue-900 text-white shadow" : ""
                }`}
                onClick={() => setRole("consumer")}
                type="button"
              >
                Consumer
              </button>

              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                  role === "legalExpert" ? "bg-blue-900 text-white shadow" : ""
                }`}
                onClick={() => setRole("legalExpert")}
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

              <div className="relative">
                <AuthInput
                  label="Password"
                  placeholder="Enter your password"
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

              {/* PASSWORD CHECKLIST */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  {Object.entries(passwordChecks)
                    .filter(([_, valid]) => !valid)
                    .map(([key]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-xs text-red-500"
                      >
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

              {/* STRENGTH BAR */}
              <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
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
            className={`auth-left transition-all duration-300 ${
              role === "consumer" ? "bg-blue-900" : "bg-indigo-900"
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
              <AlertPopup
                show={showSuccess}
                title="Registration Successful!"
                message={`Redirecting in ${countdown} seconds...`}
                showButton={false}
                buttonText="OK"
                onClose={() => setShowSuccess(false)}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
