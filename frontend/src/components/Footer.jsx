import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-logo">
          <span className="logo-icon">🛣️</span> ShadowRoad - AI
        </div>
        <div className="footer-sub">
          Predictive Digital Twin for Traffic Management & AI Legal Assistant.
        </div>
        
        <div className="footer-tags">
          <span className="ftag">Edge AI</span>
          <span className="ftag">Zero Hardware</span>
          <span className="ftag">Privacy First</span>
        </div>
        
        <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} ShadowRoad - AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
