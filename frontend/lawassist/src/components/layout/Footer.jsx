import { Mail, MapPin, Scale } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="container-custom">
        <div className="footer-surface">
          <div className="footer-grid">
            <div>
              <Link to="/" className="footer-brand" onClick={scrollTop}>
                <Scale size={22} className="footer-logo" />
                LawAssist
              </Link>

              <p className="footer-description">
                Empowering consumers with accessible legal guidance. Know your
                rights and take action with confidence.
              </p>

              <div className="footer-pill">Trusted legal support platform</div>
            </div>

            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/" className="footer-link-anchor" onClick={scrollTop}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/explore-rights"
                    className="footer-link-anchor"
                    onClick={scrollTop}
                  >
                    Explore Rights
                  </Link>
                </li>
                <li>
                  <Link
                    to="/queries"
                    className="footer-link-anchor"
                    onClick={scrollTop}
                  >
                    Submit Query
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link-anchor" onClick={scrollTop}>
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-links">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="footer-link-anchor"
                    onClick={scrollTop}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="footer-link-anchor" onClick={scrollTop}>
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="footer-link-anchor"
                    onClick={scrollTop}
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-links">
                <li>
                  <a className="footer-link-anchor footer-contact-item" href="mailto:mail.lawassist@gmail.com">
                    <Mail size={16} />
                    mail.lawassist@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    className="footer-link-anchor footer-contact-item"
                    href="https://maps.google.com/?q=Mumbai,India"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin size={16} />
                    Mumbai, India
                  </a>
                </li>
              </ul>

              <Link to="/queries" className="footer-cta-link" onClick={scrollTop}>
                Need legal help now?
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <span>© 2026 LawAssist. All rights reserved.</span>
          <Link to="/privacy-policy" className="footer-bottom-link" onClick={scrollTop}>
            Privacy
          </Link>
          <Link to="/terms" className="footer-bottom-link" onClick={scrollTop}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;