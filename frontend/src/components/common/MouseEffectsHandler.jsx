import { useEffect } from 'react';

/**
 * Global MouseEffectsHandler
 * Provides dynamic cursor spotlight tracking & smooth 3D tilt interaction
 */
export default function MouseEffectsHandler() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Find any spotlight-card under or around pointer
      const target = e.target.closest('.spotlight-card, .tilt-card, .feature-card, .trip-card, .city-card');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight radial position
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt calculation if element has tilt-card
      if (target.classList.contains('tilt-card')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg
        const rotateY = ((x - centerX) / centerX) * 7;

        target.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        target.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target.closest('.tilt-card');
      if (target) {
        target.style.setProperty('--tilt-x', '0deg');
        target.style.setProperty('--tilt-y', '0deg');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return null;
}
