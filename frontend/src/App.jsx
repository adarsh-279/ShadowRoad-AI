import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import ChallanSystem from "./components/ChallanSystem";
import DriveLegal from "./components/DriveLegal";
import LawsRegulations from "./components/LawsRegulations";
import ImpactSection from "./components/ImpactSection";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Animated Background */}
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ChallanSystem />
      <DriveLegal />
      <LawsRegulations />
      <ImpactSection />
      <Footer />
    </div>
  );
}

export default App;
