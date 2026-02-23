import { Scale } from "lucide-react";
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
              Empowering consumers with accessible legal guidance.
              Know your rights and take action with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">QUICK LINKS</h4>
            <ul className="footer-links">
              <li>Home</li>
              <li>Explore Rights</li>
              <li>Submit Query</li>
              <li>About</li>
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
              <li>support@lawassist.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Legal Avenue, Suite 400</li>
              <li>New York, NY 10001</li>
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