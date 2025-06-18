'use client';

import React from 'react';

type GaugeProps = {
  label: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  steps?: number;
  angleRange?: number; // z. B. 150°
};

export default function Gauge({
  label,
  value,
  unit,
  min = 0,
  max = 100,
  steps = 9,
  angleRange = 180,
}: GaugeProps) {
  const angle = ((value - min) / (max - min)) * angleRange - angleRange / 2;

  const ticks = Array.from({ length: steps + 1 }, (_, i) => {
    const val = min + ((max - min) / steps) * i;
    const tickAngle = ((val - min) / (max - min)) * angleRange - angleRange / 2;
    return { val: Math.round(val), angle: tickAngle };
  });

  return (
    <div className="gauge">
      <div className="gauge-label">{label}</div>

      <div className="gauge-body">
        {ticks.map((tick, idx) => (
          <div
            key={idx}
            className="gauge-tick"
            style={{
              transform: `rotate(${tick.angle}deg) translateY(-40px)`,
              position: 'absolute',
              bottom: 0,
              left: '50%',
            }}
          >
            <div className="gauge-tick-label">{tick.val}</div>
          </div>
        ))}

        <div
          className="gauge-needle"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>
        <div className="gauge-center"></div>
      </div>

      <div className="gauge-value">
        {value} {unit}
      </div>
    </div>
  );
}
