import { Scale } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container-custom">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <Scale size={22} className="footer-logo" />
              LawAssist
            </div>

            <p className="footer-description">
              Empowering consumers with accessible legal guidance. Know your
              rights and take action with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">QUICK LINKS</h4>
            <ul className="footer-links">
              <li>
                <Link
                  to="/"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Home
                </Link>
              </li>
              <li>Explore Rights</li>
              <li>Submit Query</li>
              <li>
                <Link
                  to="/about"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-heading">LEGAL</h4>
            <ul className="footer-links">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Disclaimer</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">CONTACT</h4>
            <ul className="footer-links">
              <li>lawassist@gmail.com</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          © 2026 LawAssist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
