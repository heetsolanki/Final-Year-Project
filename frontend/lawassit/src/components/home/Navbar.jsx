import { Scale } from "lucide-react";

function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="navbar">

        {/* LEFT LINKS */}
        <div className="nav-links">
          <span className="nav-link">Home</span>
          <span className="nav-link">Explore Rights</span>
          <span className="nav-link">Submit Query</span>
        </div>

        {/* CENTER LOGO */}
        <div className="text-[#0A1F44] hover:text-[#C9A227] transition cursor-pointer">
          <Scale size={28} />
        </div>

        {/* RIGHT LINKS + BUTTONS */}
        <div className="nav-links">

          <span className="nav-link">Experts</span>
          <span className="nav-link">About</span>

          <button className="nav-btn nav-login">
            Login
          </button>

          <button className="nav-btn nav-register">
            Register
          </button>

        </div>

      </nav>
    </div>
  );
}

export default Navbar;