import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Scale, Menu, X, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../api";
import axios from "axios";
import ToastPopup from "../ui/ToastPopup";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  // Show logout toast after redirect
  useEffect(() => {
    if (sessionStorage.getItem("showLogoutToast") === "true") {
      sessionStorage.removeItem("showLogoutToast");
      setShowLogoutToast(true);
      setTimeout(() => setShowLogoutToast(false), 2500);
    }
  }, [location]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decoded.role);

          if (decoded.role === "consumer") {
            const res = await axios.get(`${API_URL}/api/users/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setUserName(res.data.name);
          } else if (decoded.role === "legalExpert") {
            const res = await axios.get(`${API_URL}/api/expert/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserName(res.data.name);
          }
        } catch {
          setIsLoggedIn(false);
          setUserRole(null);
          setUserName("");
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName("");
      }
    };

    checkAuth();
  }, [location]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");
    sessionStorage.setItem("showLogoutToast", "true");
    navigate("/");
  };

  if (location.pathname.startsWith("/admin-dashboard")) {
    return null;
  }

  return (
    <div className="nav-wrapper">
      <nav className="navbar">
        <div className="nav-links nav-links-left">
          <Link
            to="/"
            className="nav-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Home
          </Link>
          <Link
            to="/explore-rights"
            className="nav-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Explore Rights
          </Link>
          <Link
            to="/queries"
            className="nav-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Queries
          </Link>
        </div>

        <Link
          to="/"
          className="nav-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Scale size={28} className="nav-logo-icon" />
          <span className="nav-logo-text">LawAssist</span>
        </Link>

        <div className="nav-links nav-links-right">
          {userRole !== "legalExpert" && (
            <Link
              to="/experts"
              className="nav-link"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Experts
            </Link>
          )}
          <Link
            to="/about"
            className="nav-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            About
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="nav-btn nav-login"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-btn nav-register"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {userRole === "consumer" && (
                <Link
                  to="/user-dashboard"
                  className="nav-profile-link"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <User2Icon size={18} />
                  <span className="nav-profile-name">{userName}</span>
                </Link>
              )}
              {userRole === "legalExpert" && (
                <Link
                  to="/legal-expert-dashboard"
                  className="nav-profile-link"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <User2Icon size={18} />
                  <span className="nav-profile-name">{userName}</span>
                </Link>
              )}
              <button className="nav-btn nav-register" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <Link
          to="/"
          className="nav-link"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Home
        </Link>
        <Link
          to="/explore-rights"
          className="nav-link"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Explore Rights
        </Link>
        <Link
          to="/queries"
          className="nav-link"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Queries
        </Link>
        {userRole === "consumer" && (
          <Link
            to="/experts"
            className="nav-link"
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Experts
          </Link>
        )}
        <Link
          to="/about"
          className="nav-link"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          About
        </Link>

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="nav-btn nav-login w-full text-center"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="nav-btn nav-register w-full text-center"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to={
                userRole === "consumer"
                  ? "/user-dashboard"
                  : "/legal-expert-dashboard"
              }
              className="nav-login nav-btn w-full text-center"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {userRole === "consumer" ? "My Dashboard" : "Expert Dashboard"}
            </Link>
            <button
              className="nav-btn nav-register w-full"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
      <ToastPopup show={showLogoutToast} message="Logout Successful" type="success" />
    </div>
  );
}

export default Navbar;
