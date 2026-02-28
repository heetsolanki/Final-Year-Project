import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!form.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
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

    if (!form.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        form.password,
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        password: "Please enter a valid password",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }, [form.email, form.password]);

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

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const passwordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password);

  const formValid = emailValid && passwordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!emailValid) newErrors.email = "Enter a valid email address";

    if (!passwordValid) newErrors.password = "Invalid password format";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("https://lawassist-wgvq.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ email: data.message });
          return;
        }

        // ✅ Store JWT token
        localStorage.setItem("token", data.token);

        setShowSuccess(true);
        setCountdown(3);

        setForm({
          email: "",
          password: "",
        });

        // ✅ Role-based redirect
        setTimeout(() => {
          if (data.role === "consumer") {
            navigate("/user-dashboard");
          } else if (data.role === "legalExpert") {
            navigate("/legal-expert-dashboard");
          }
        }, 3000);
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

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
              Access your dashboard, manage legal queries, and connect with
              verified legal professionals.
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="auth-right">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Please login to your account</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />

              <AuthInput
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

              <div className="auth-options">
                <label className="remember">
                  <input type="checkbox" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="auth-link"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Forgot Password?
                </Link>
              </div>

              <AuthButton text="Login" disabled={!formValid} />

              <p className="auth-switch">
                Don’t have an account?
                <Link
                  to="/register"
                  className="auth-link"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Create Account
                </Link>
              </p>
            </form>
            {showSuccess && (
              <div className="popup-overlay">
                <div className="popup-card">
                  <CheckCircle size={50} className="popup-icon" />
                  <p className="popup-text">Login Successful!</p>

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

export default Login;
