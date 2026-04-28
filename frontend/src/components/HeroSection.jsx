import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero" id="hero">

      <h1 className="hero-title">
        <span className="ht-shadow">ShadowRoad - AI</span>
      </h1>
      <p className="hero-sub">Complete AI Road Safety System — Predictive Digital Twin for Traffic Management & AI Legal Assistant for Road Compliance & Driver Trust</p>
      <div className="hero-tags">
        <span className="tag">Built for India</span>
        <span className="tag">Built in India</span>
      </div>
      <div className="hero-ctas">
        <a href="#demo" className="btn-primary" id="hero-try-btn">🚀 Try Live Demo</a>
        <a href="#how-it-works" className="btn-secondary" id="hero-learn-btn">Learn More</a>
      </div>
      <div className="hero-stats">
        <div className="hstat">
          <div className="hstat-val">1.78L</div>
          <div className="hstat-label">Deaths/year</div>
        </div>
        <div className="hstat-div"></div>
        <div className="hstat">
          <div className="hstat-val">40%</div>
          <div className="hstat-label">Reduction target</div>
        </div>
        <div className="hstat-div"></div>
        <div className="hstat">
          <div className="hstat-val">₹24Cr</div>
          <div className="hstat-label">Estimated Annual revenue</div>
        </div>
        <div className="hstat-div"></div>
        <div className="hstat">
          <div className="hstat-val">1Cr+</div>
          <div className="hstat-label">Lives impacted</div>
        </div>
      </div>
      {/* Animated road visual */}
      <div className="road-anim" aria-hidden="true">
        <div className="road-line"></div>
        <div className="road-car car-1">🚗</div>
        <div className="road-car car-2">🚙</div>
        <div className="road-car car-3">🏍️</div>
        <div className="road-car car-4">🚕</div>
        <div className="road-car car-5">🚛</div>
        <div className="road-car car-6">🚴</div>
      </div>
    </section>
  );
};

export default HeroSection;
