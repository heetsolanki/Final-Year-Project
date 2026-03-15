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
          if (userRole === "consumer") {
            const res = await axios.get(`${API_URL}/api/users/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setUserName(res.data.name);
          } else if (userRole === "legalExpert") {
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
  }, [location, userRole]);

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
        {/* LEFT LINKS */}
        <div className="nav-links">
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

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 whitespace-nowrap text-[#0A1F44] hover:text-[#C9A227] transition cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Scale size={28} className="nav-logo" />
          <span className="nav-logo-text">LawAssist</span>
        </Link>

        {/* RIGHT LINKS */}
        <div className="nav-links">
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
                  className="nav-login px-3 py-2 flex items-center align-center gap-1 rounded-full border border-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <User2Icon size={18} />
                  <span className="text-sm font-medium">{userName}</span>
                </Link>
              )}
              {userRole === "legalExpert" && (
                <Link
                  to="/legal-expert-dashboard"
                  className="nav-login px-3 py-2 flex items-center align-center gap-1 rounded-full border border-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <User2Icon size={18} />
                  <span className="text-sm font-medium">{userName}</span>
                </Link>
              )}
              <button className="nav-btn nav-register" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* HAMBURGER */}
        <div className="nav-hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
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
