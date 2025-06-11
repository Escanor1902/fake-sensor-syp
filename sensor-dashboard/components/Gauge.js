'use client';

import React from 'react';

export default function Gauge({ label, value, unit, min, max }) {
  const angle = ((value - min) / (max - min)) * 180 - 90; // Zeiger von -90° bis +90°

  return (
    <div className="gauge">
      <div className="gauge-label">{label}</div>
      <div className="gauge-body">
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>
        <div className="gauge-center"></div>
      </div>
      <div className="gauge-value">{value} {unit}</div>
    </div>
  );
}
