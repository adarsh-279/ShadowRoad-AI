import React, { useEffect, useRef } from 'react';

const HowItWorks = () => {
  const stepsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    if (stepsRef.current) {
      const children = stepsRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">PS1 — ShadowRoad AI</div>
          <h2 className="section-title">How ShadowRoad AI Works</h2>
          <p className="section-desc">Privacy-first AI that predicts danger before it happens — no cameras, no surveillance.</p>
        </div>
        <div className="steps-grid" ref={stepsRef}>
          <div className="step-card" id="step-1">
            <div className="step-num">01</div>
            <div className="step-icon">📡</div>
            <h3 className="step-title">You Ride or Drive</h3>
            <p className="step-desc">Any device works — no extra hardware needed. App runs silently in background.</p>
            <div className="step-tag">GPS-Detected</div>
          </div>
          <div className="step-card" id="step-2">
            <div className="step-num">02</div>
            <div className="step-icon">📱</div>
            <h3 className="step-title">Phone Reads Sensors</h3>
            <p className="step-desc">Gyroscope · GPS · Accelerometer — your phone becomes a black box. Data stays on-device.</p>
            <div className="step-tag">Gyro + GPS</div>
          </div>
          <div className="step-card" id="step-3">
            <div className="step-num">03</div>
            <div className="step-icon">🧠</div>
            <h3 className="step-title">AI Stays On-Phone</h3>
            <p className="step-desc">Digital twin processes everything locally. Your data never goes to any server.</p>
            <div className="step-tag">Edge AI</div>
          </div>
          <div className="step-card" id="step-4">
            <div className="step-num">04</div>
            <div className="step-icon">🗺️</div>
            <h3 className="step-title">Live Road Map Built</h3>
            <p className="step-desc">Digital twin of your route created and updated every second with crowd signals.</p>
            <div className="step-tag">Update / sec</div>
          </div>
          <div className="step-card" id="step-5">
            <div className="step-num">05</div>
            <div className="step-icon">⚠️</div>
            <h3 className="step-title">AI Predicts Danger</h3>
            <p className="step-desc">Identifies accidents 30 seconds before they happen using behavioral patterns.</p>
            <div className="step-tag danger-tag">30s Before</div>
          </div>
          <div className="step-card" id="step-6">
            <div className="step-num">06</div>
            <div className="step-icon">📳</div>
            <h3 className="step-title">Phone Vibrates — WARN</h3>
            <p className="step-desc">Haptic + audio alert. Notifies cops · connections · authorities · ambulances instantly.</p>
            <div className="step-tag">Auto-Alert</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
