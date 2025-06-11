'use client';

import React from 'react';
import Gauge from './Gauge';

export default function SensorGauges({ values }) {
  return (
    <>
      <Gauge label="Temperatur" value={values.temp} unit="°C" />
      <Gauge label="Luftfeuchtigkeit" value={values.humidity} unit="%" />
      <Gauge label="Windgeschwindigkeit" value={values.wind} unit="km/h" />
      <Gauge label="UV-Index" value={values.uv} unit="" />
    </>
  );
}
