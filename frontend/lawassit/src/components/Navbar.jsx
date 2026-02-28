import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decoded.role);
        } catch (error) {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

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
          className="text-[#0A1F44] hover:text-[#C9A227] transition cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Scale size={28} />
        </Link>

        {/* RIGHT LINKS */}
        <div className="nav-links">
          <Link
            to="/experts"
            className="nav-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Experts
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            About
          </Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-btn nav-login">
                Login
              </Link>

              <Link to="/register" className="nav-btn nav-register">
                Register
              </Link>
            </>
          ) : (
            <>
              {userRole === "consumer" && (
                <Link to="/user-dashboard" className="nav-btn nav-login">
                  My Dashboard
                </Link>
              )}

              {userRole === "legalExpert" && (
                <Link to="/legal-expert-dashboard" className="nav-btn nav-login">
                  Expert Dashboard
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
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="nav-link"
        >
          Explore Rights
        </Link>
        <Link
          to="/queries"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="nav-link"
        >
          Queries
        </Link>
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
              onClick={() => setIsOpen(false)}
            >
              {userRole === "consumer" ? "My Dashboard" : "Expert Dashboard"}
            </Link>

            <button
              className="nav-btn nav-register w-full"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
