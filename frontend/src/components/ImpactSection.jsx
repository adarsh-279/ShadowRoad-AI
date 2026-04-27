import React from 'react';

const ImpactSection = () => {
  return (
    <section className="section section-dark" id="impact">
      <div className="container">
        <div className="section-header">
          <div className="section-badge laws-badge">Scale & Impact</div>
          <h2 className="section-title">Saving Lives Nationwide</h2>
          <p className="section-desc">Our digital twin predictive network is actively expanding to secure every major road in India.</p>
        </div>
        
        <div className="impact-grid">
          <div className="impact-card highlight-impact">
            <div className="impact-num">30s</div>
            <div className="impact-label">Pre-Crash Prediction</div>
            <div className="impact-sub">Faster response time via Edge AI</div>
          </div>
          
          <div className="impact-card">
            <div className="impact-num">24/7</div>
            <div className="impact-label">Auto-Challan Monitoring</div>
            <div className="impact-sub">Zero manual intervention</div>
          </div>
          
          <div className="impact-card">
            <div className="impact-num">₹10K+</div>
            <div className="impact-label">Avg. Legal Savings</div>
            <div className="impact-sub">Per user fighting unfair claims</div>
          </div>
          
          <div className="impact-card">
            <div className="impact-num">1.2km</div>
            <div className="impact-label">Ambulance Routing</div>
            <div className="impact-sub">Auto pinpointing to nearest hospital</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
