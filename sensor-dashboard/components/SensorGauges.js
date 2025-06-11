'use client';

import React from 'react';
import Gauge from './Gauge';

export default function SensorGauges({ values }) {
  return (
    <>
<Gauge label="Temperatur" value={values.temp} unit="°C" min={-10} max={40} />
<Gauge label="Luftfeuchtigkeit" value={values.humidity} unit="%" min={0} max={100} />
<Gauge label="Windgeschwindigkeit" value={values.wind} unit="km/h" min={0} max={120} />
<Gauge label="UV-Index" value={values.uv} unit="" min={0} max={11} />

    </>
  );
}
