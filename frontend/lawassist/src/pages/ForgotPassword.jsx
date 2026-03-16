import { useState, useEffect } from "react";
import API_URL from "../api";
import { Link } from "react-router-dom";
import { XCircle, Eye, EyeOff } from "lucide-react";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import AlertPopup from "../components/ui/AlertPopup";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [timer, setTimer] = useState(120);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* PASSWORD RULES */
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const strengthPercent =
    (Object.values(passwordChecks).filter(Boolean).length / 5) * 100;

  /* OTP TIMER */
  useEffect(() => {
    if (step !== 2) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* MAIN FORM HANDLER */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    /* STEP 1 → SEND OTP */
    if (step === 1) {
      if (!email) {
        setErrors({ email: "Email is required" });
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/auth/send-reset-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ email: data.message });
          setLoading(false);
          return;
        }

        setTimer(120);
        setStep(2);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    } else if (step === 2) {
      /* STEP 2 → VERIFY OTP */
      if (otp.join("").length !== 6) {
        setErrors({ otp: "OTP must be 6 digits" });
        return;
      }

      try {
        setLoading(true);

        const otpValue = otp.join("");

        const res = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpValue }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ otp: data.message });
          setLoading(false);
          return;
        }

        setResetToken(data.resetToken);
        setStep(3);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    } else if (step === 3) {
      /* STEP 3 → RESET PASSWORD */
      if (!Object.values(passwordChecks).every(Boolean)) {
        setErrors({ password: "Password does not meet requirements" });
        return;
      }

      if (!passwordsMatch) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            resetToken,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ password: data.message });
          setLoading(false);
          return;
        }

        setShowSuccess(true);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const resendOTP = () => {
    if (!loading) {
      setStep(1);
      handleSubmit({ preventDefault: () => {} });
    }
  };

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-left bg-blue-900">
            <h2 className="text-3xl font-semibold mb-4">Forgot Password?</h2>

            {step === 1 && <p>Enter your email to receive an OTP.</p>}
            {step === 2 && <p>Enter the OTP sent to your email.</p>}
            {step === 3 && <p>Create a new secure password.</p>}
          </div>

          <div className="auth-right">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-1">
              Reset Password
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
              We'll send an OTP to verify your identity.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <AuthInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    placeholder="Enter your email"
                  />

                  <div className="mt-4">
                    <AuthButton
                      text={loading ? "Sending..." : "Send OTP"}
                      disabled={!emailValid || loading}
                    />
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Enter OTP
                    </label>

                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                          className="w-10 h-10 border rounded text-center text-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>

                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-2">{errors.otp}</p>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mt-2">
                    OTP expires in {formatTime(timer)}
                  </div>

                  {timer === 0 && (
                    <button
                      type="button"
                      className="text-blue-900 text-sm font-medium mt-2"
                      onClick={resendOTP}
                    >
                      Resend OTP
                    </button>
                  )}

                  <div className="mt-4">
                    <AuthButton
                      text={loading ? "Verifying..." : "Verify OTP"}
                      disabled={otp.join("").length !== 6 || loading}
                    />
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <AuthInput
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    placeholder="Enter new password"
                  >
                    <button
                      type="button"
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </AuthInput>

                  {password && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(passwordChecks)
                        .filter(([_, valid]) => !valid)
                        .map(([key]) => (
                          <div
                            key={key}
                            className="flex gap-2 text-xs text-red-500"
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
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    placeholder="Confirm password"
                  >
                    <button
                      type="button"
                      className="eye-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </AuthInput>

                  <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>

                  <div className="mt-4">
                    <AuthButton
                      text={loading ? "Resetting..." : "Reset Password"}
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <p className="auth-switch mt-4">
                Remembered your password?
                <Link to="/login"> Login</Link>
              </p>
            </form>
          </div>
        </div>

        {showSuccess && (
          <AlertPopup
            show={showSuccess}
            type="success"
            title="Password Reset Successful!"
            description="You will be redirected to the login page."
            redirectTo="/login"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </>
  );
}

export default ForgotPassword;
