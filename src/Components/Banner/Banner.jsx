import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Banner.css";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

export default function Banner() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [targetPath, setTargetPath] = useState("");

  const handleNavigation = (path) => {
    const isLoggedIn = localStorage.getItem("user"); // Check if user is logged in
    if (!isLoggedIn) {
      setTargetPath(path);
      setShowLoginPopup(true);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.classList.add("sb-banner__visible");
    }, { threshold: .4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="sb-banner" aria-label="Hero">
      <div className="sb-banner__wrap" ref={ref}>
        <div className="sb-banner__text">
          <h1>
            The task switchboard that <span className="accent">helps teams move fast</span>
          </h1>
          <p>
            Track tasks, progress, and ownership—effortlessly. Lightweight by design, built for mobile,
            and ready for your team’s momentum.
          </p>
          <div className="sb-banner__cta">
            <button 
              className="btn btn--primary" 
              onClick={() => handleNavigation("/assignments")}
            >
              Go to Assignments
            </button>
            <button 
              className="btn btn--ghost" 
              onClick={() => handleNavigation("/leaderboard")}
            >
              View Leaderboard
            </button>
          </div>
        </div>

        {showLoginPopup && (
          <Login 
            onClose={() => setShowLoginPopup(false)}
            switchToSignup={() => {
              setShowLoginPopup(false);
              setShowSignupPopup(true);
            }}
            onSuccess={() => {
              setShowLoginPopup(false);
              navigate(targetPath);
            }}
          />
        )}

        {showSignupPopup && (
          <Signup
            onClose={() => setShowSignupPopup(false)}
            switchToLogin={() => {
              setShowSignupPopup(false);
              setShowLoginPopup(true);
            }}
          />
        )}

        {/* Keep right side clean; placeholder reserved for future visuals */}
        <div className="sb-banner__right" aria-hidden="true">
          {/* Optional: add a decorative gradient orb if you want */}
        </div>
      </div>
    </section>
  );
}
