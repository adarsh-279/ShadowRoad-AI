import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${isScrolled ? 'scrolled' : ''}`} id="main-nav">
      <div className="nav-inner">
        <div className="nav-logo">
          <div className="logo-icon">🛣️</div>
          <div className="logo-text">
            <span className="logo-shadow">ShadowRoad </span>
            <span className="logo-x">-</span>
            <span className="logo-sep"> AI </span>
          </div>
        </div>
        <div className={`nav-links ${isOpen ? 'open' : ''}`} id="nav-links">
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}>How It Works</a>
          <a href="#auto-challan" onClick={() => setIsOpen(false)} className={`nav-link ${activeSection === 'auto-challan' ? 'active' : ''}`}>Auto-Challan</a>
          <a href="#drivelegal" onClick={() => setIsOpen(false)} className={`nav-link ${activeSection === 'drivelegal' ? 'active' : ''}`}>DriveLegal</a>
          <a href="#laws" onClick={() => setIsOpen(false)} className={`nav-link ${activeSection === 'laws' ? 'active' : ''}`}>Laws</a>
          <a href="#demo" onClick={() => setIsOpen(false)} className="nav-cta">Try Demo</a>
        </div>
        <button 
          className="nav-hamburger" 
          id="nav-hamburger" 
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
