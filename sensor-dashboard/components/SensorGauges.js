'use client';

import React from 'react';
import Gauge from './Gauge';

export default function SensorGauges({ values }) {
  return (
    <div className="gauges">
      <Gauge label="Wind" value={values.wind} unit="km/h" min={0} max={150} />
      <Gauge label="UV" value={values.uv} unit="" min={0} max={11} />
      <Gauge label="Temperatur" value={values.temp} unit="°C" min={-20} max={50} />
      <Gauge label="Luftfeuchtigkeit" value={values.humidity} unit="%" min={0} max={100} />
    </div>
  );
}
