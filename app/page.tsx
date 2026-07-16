"use client";

import React, { useMemo, useState } from "react";

const WATTS_PER_PANEL = 410;
const SOLAR_EPC = 2.4;
const BATTERY_COST = 12500;
const DIFFERENTIAL_PERCENT = 0.9;

const fmtMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const fmtNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value || 0);

export default function Home() {
  const [panels, setPanels] = useState(20);
  const [batteries, setBatteries] = useState(1);
  const [saleEpc, setSaleEpc] = useState(4.3);

  const data = useMemo(() => {
    const panelCount = Math.max(0, Number(panels) || 0);
    const batteryCount = Math.max(0, Number(batteries) || 0);
    const saleEpcValue = Math.max(0, Number(saleEpc) || 0);

    const watts = panelCount * WATTS_PER_PANEL;
    const kw = watts / 1000;
    const systemCost =
      watts * SOLAR_EPC + batteryCount * BATTERY_COST;
    const baseEpc = watts > 0 ? systemCost / watts : 0;
    const commissionDifference =
      (saleEpcValue - baseEpc) *
      watts *
      DIFFERENTIAL_PERCENT;

    return {
      watts,
      kw,
      systemCost,
      baseEpc,
      saleEpc: saleEpcValue,
      commissionDifference,
    };
  }, [panels, batteries, saleEpc]);

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="topbar">
          <div>
            <div className="brand">
              <span className="brand-hqs">HQS</span>{" "}
              <span className="brand-energy">ENERGY</span>
            </div>

            <h1>Calculadora interna de EPC y comisión</h1>
            <p className="subtitle">
              Calcula tamaño del sistema, costo base, EPC base y diferencia de comisión.
            </p>
          </div>

          <div className="private-badge">Modo visual privado</div>
        </header>

        <div className="main-grid">
          <section className="panel">
            <div className="panel-heading">
              <h2>Entradas</h2>
              <span className="program-badge">Programa activo: Sunrun</span>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label>Compañía</label>
                <div className="readonly-field">Sunrun</div>
              </div>

              <div className="field">
                <label htmlFor="panels">Cantidad de paneles</label>
                <input
                  id="panels"
                  type="number"
                  min="0"
                  value={panels}
                  onChange={(event) => setPanels(Number(event.target.value))}
                />
              </div>

              <div className="field">
                <label>Watts por panel</label>
                <div className="readonly-field">410 W</div>
              </div>

              <div className="field">
                <label htmlFor="batteries">Cantidad de baterías</label>
                <input
                  id="batteries"
                  type="number"
                  min="0"
                  value={batteries}
                  onChange={(event) => setBatteries(Number(event.target.value))}
                />
              </div>

              <div className="field">
                <label>Marca de batería</label>
                <div className="readonly-field">Tesla</div>
              </div>

              <div className="field full">
                <label htmlFor="saleEpc">EPC de venta</label>
                <input
                  id="saleEpc"
                  className="epc-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={saleEpc}
                  onChange={(event) => setSaleEpc(Number(event.target.value))}
                />
                <p className="helper-text">Diferencial basado en el 90%.</p>
              </div>
            </div>

            <div className="epc-grid">
              <article className="metric accent-blue">
                <span>EPC Base</span>
                <strong>{fmtNumber(data.baseEpc)}</strong>
              </article>

              <article className="metric accent-gold">
                <span>EPC Venta</span>
                <strong>{fmtNumber(data.saleEpc)}</strong>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Resultados</h2>
            </div>

            <div className="results-grid">
              <article className="metric accent-blue">
                <span>kW</span>
                <strong>{fmtNumber(data.kw)} kW</strong>
              </article>

              <article className="metric">
                <span>Watts</span>
                <strong>{fmtNumber(data.watts, 0)} W</strong>
              </article>

              <article className="metric full">
                <span>Costo del sistema</span>
                <strong>{fmtMoney(data.systemCost)}</strong>
              </article>

              <article
                className={`metric full ${
                  data.commissionDifference < 0
                    ? "accent-red"
                    : "accent-gold"
                }`}
              >
                <span>Diferencia en comisión</span>
                <strong>{fmtMoney(data.commissionDifference)}</strong>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
