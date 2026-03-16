import API_URL from "../api";
import { useState, useEffect } from "react";
import { Scale, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import AlertPopup from "../components/ui/AlertPopup";
import BlockedUserPopup from "../components/users/BlockedUserPopup";

function Login() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/user-dashboard");
  const [loading, setLoading] = useState(false);
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

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const passwordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password);

  const formValid = emailValid && passwordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    setLoading(true);

    if (!emailValid) newErrors.email = "Enter a valid email address";

    if (!passwordValid) newErrors.password = "Invalid password format";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
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
          setLoading(false);
          if (response.status === 403) {
            setShowBlocked(true);
            return;
          }
          setErrors({ email: data.message });
          return;
        }

        localStorage.setItem("token", data.token);

        if (data.role === "consumer") {
          setRedirectPath("/user-dashboard");
        } else if (data.role === "legalExpert") {
          setRedirectPath("/legal-expert-dashboard");
        } else if (data.role === "admin") {
          setRedirectPath("/admin-dashboard");
        }

        setShowSuccess(true);
        setLoading(false);

        setForm({
          email: "",
          password: "",
        });
      } catch (error) {
        console.error("Login error:", error);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* LEFT SECTION */}
          <div className="auth-left">
            <div className="auth-brand">
              <Scale size={32} className="brand-icon" />
              <h1>LawAssist</h1>
            </div>

            <h2 className="text-3xl font-semibold leading-snug mb-4">
              Empowering Consumer Rights with Smart Legal Support
            </h2>

            <p className="text-gray-200">
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

              <AuthButton text={loading ? "Logging in..." : "Login"} disabled={!formValid || loading} />

              <p className="auth-switch">
                Don't have an account?
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
            <AlertPopup
              show={showSuccess}
              type="success"
              title="Login Successful!"
              description="You are being redirected to your dashboard."
              redirectTo={redirectPath}
              onClose={() => setShowSuccess(false)}
            />
            {showBlocked && <BlockedUserPopup onClose={() => {
              setShowBlocked(false);
              setForm({ email: "", password: "" });
              setErrors({});
            }} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
