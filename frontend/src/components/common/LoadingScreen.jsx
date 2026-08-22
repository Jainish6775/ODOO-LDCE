import { useEffect, useState } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15) + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="luxury-preloader-screen">
      {/* Background Ambient Orbs */}
      <div className="preloader-ambient-orb orb-emerald"></div>
      <div className="preloader-ambient-orb orb-indigo"></div>

      <div className="preloader-content-card">
        {/* Glowing Logo Avatar */}
        <div className="preloader-logo-ring">
          <img src="/logo.jpg" alt="GlobeTrotter" className="preloader-logo-img" />
          <div className="logo-pulse-aura"></div>
        </div>

        {/* Brand Title & Tagline */}
        <h1 className="preloader-brand-title">GlobeTrotter</h1>
        <p className="preloader-tagline">Curating your ultimate travel experience...</p>

        {/* Progress Bar Container */}
        <div className="preloader-progress-track">
          <div 
            className="preloader-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status Percentage Badge */}
        <div className="preloader-status-text">
          <span>Loading resources</span>
          <span className="font-mono font-bold text-emerald-400">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
