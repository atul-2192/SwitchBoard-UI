import React from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="sb-footer">
      <div className="sb-footer__top">
        <div className="sb-footer__container">
          <div className="sb-footer__grid">
            {/* Brand Section */}
            <div className="sb-footer__brand-section">
              <div className="sb-footer__logo">
                <span className="sb-footer__logo-text">Switch<span className="sb-footer__logo-highlight">Board</span></span>
              </div>
              <p className="sb-footer__tagline">Build momentum. Ship faster.</p>
              <div className="sb-footer__social">
                <a href="#" aria-label="Twitter" className="sb-footer__social-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="sb-footer__social-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" aria-label="GitHub" className="sb-footer__social-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              </div>
            </div>

            {/* Resources Section */}
            <div className="sb-footer__links-section">
              <h3 className="sb-footer__heading">Resources</h3>
              <ul className="sb-footer__links-list">
                <li><a href="/documentation">Documentation</a></li>
                <li><a href="/tutorials">Tutorials</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="sb-footer__links-section">
              <h3 className="sb-footer__heading">Company</h3>
              <ul className="sb-footer__links-list">
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="sb-footer__newsletter-section">
              <h3 className="sb-footer__heading">Stay Updated</h3>
              <p className="sb-footer__newsletter-text">Get the latest updates, tutorials, and offers.</p>
              <form className="sb-footer__nl" onSubmit={(e)=>e.preventDefault()} aria-label="Newsletter">
                <label htmlFor="nl" className="sr-only">Email</label>
                <div className="sb-footer__input-group">
                  <input id="nl" type="email" placeholder="Enter your email" inputMode="email" />
                  <button type="submit">Subscribe</button>
                </div>
              </form>
              <p className="sb-footer__newsletter-disclaimer">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sb-footer__bottom">
        <div className="sb-footer__container">
          <div className="sb-footer__copyright">
            <p>© {currentYear} SwitchBoard. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
