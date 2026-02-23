import { useState } from "react";
import { Scale, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav-wrapper">
      <nav className="navbar">
        {/* LEFT LINKS */}
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <span className="nav-link">Explore Rights</span>
          <span className="nav-link">Submit Query</span>
        </div>

        {/* LOGO */}
        <div className="text-[#0A1F44] hover:text-[#C9A227] transition cursor-pointer">
          <Scale size={28} />
        </div>

        {/* RIGHT LINKS */}
        <div className="nav-links">
          <span className="nav-link">Experts</span>
          <Link to="/about" className="nav-link">
            About
          </Link>

          <Link to="/login" className="nav-btn nav-login">
            Login
          </Link>

          <Link to='/register' className="nav-btn nav-register">Register</Link>
        </div>

        {/* HAMBURGER */}
        <div className="nav-hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <span className="nav-link">Explore Rights</span>
        <span className="nav-link">Submit Query</span>
        <span className="nav-link">Experts</span>
        <Link to="/about" className="nav-link">
          About
        </Link>

        <Link to="/login" className="nav-btn nav-login w-full text-center">Login</Link>

        <Link to="/register" className="nav-btn nav-register w-full text-center">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
