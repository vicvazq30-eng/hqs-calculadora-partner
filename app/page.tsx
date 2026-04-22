"use client";
import React, { useMemo, useState } from "react";

const WATTS_PER_PANEL = 410;
const EPC_RATE = 2.4; // nuevo EPC base
const BATTERY_PRICE = 12500; // todas iguales

const ROLE_RATES = {
  trainee: 0.06,
  consultor: 0.1,
  lider: 0.11,
  gerente: 0.12,
  partner: 0.14,
};

const ROLE_LABELS = {
  trainee: "Trainee",
  consultor: "Consultor",
  lider: "Líder",
  gerente: "Gerente",
  partner: "Partner",
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-PR", { style: "currency", currency: "USD" }).format(Number.isFinite(n) ? n : 0);
const fmtNum = (n, d = 2) =>
  new Intl.NumberFormat("es-PR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(Number.isFinite(n) ? n : 0);
const fmtEpc = (n) => {
  if (!Number.isFinite(n)) return "0.00";
  const fixed = n.toFixed(2).replace('.', '');
  return `${fixed[0]}.${fixed.slice(1,3)}`;
};

export default function HQSCalculadoraPartner() {
  const [panels, setPanels] = useState(20);
  const [batteries, setBatteries] = useState(1);
  const [role, setRole] = useState("consultor");
  const [saleEpc, setSaleEpc] = useState(0);
  const [c1, setC1] = useState(800);
  const [c2, setC2] = useState(950);
  const [c3, setC3] = useState(900);

  const avg = (Number(c1) + Number(c2) + Number(c3)) / 3 || 0;
  const panelProductionMonthly = 5986 / 12 / 10;
  const panelsNeeded = avg > 0 ? avg / panelProductionMonthly : 0;

  const data = useMemo(() => {
    const p = Number(panels) || 0;
    const b = Number(batteries) || 0;
    const saleEpcValue = Number(saleEpc) || 0;
    const roleRate = ROLE_RATES[role] || 0;

    const watts = p * WATTS_PER_PANEL;
    const kw = watts / 1000;

    const solarTotal = watts * EPC_RATE;
    const batteryTotal = b * BATTERY_PRICE;
    const total = solarTotal + batteryTotal;

    const epc = kw > 0 ? total / kw : 0;
    const commission = total * roleRate;

    const saleEpcFinal = saleEpcValue > 0 ? saleEpcValue : epc;
    const saleTotal = kw > 0 ? kw * 1000 * saleEpcFinal : 0;
    const saleCommission = saleTotal * roleRate;
    const extraCommission = Math.max(saleCommission - commission, 0);

    return {
      watts,
      kw,
      total,
      epc,
      commission,
      saleEpc: saleEpcFinal,
      saleTotal,
      saleCommission,
      extraCommission,
    };
  }, [panels, batteries, role, saleEpc]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex justify-center md:justify-start">
              <div className="text-4xl font-bold tracking-wide md:text-5xl">
                <span className="text-amber-500">HQS</span>{" "}
                <span className="text-sky-500">ENERGY</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">HQS Calculadora Partner</h1>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm">
            <span className="text-sm text-slate-700">Modo visual privado</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-white p-6 shadow-lg border border-sky-100">
            <div className="mb-5 text-xl font-semibold">Entradas</div>
            <div className="grid gap-5 md:grid-cols-2">
              <StaticField label="Compañía" value="Sunrun" full />

              <NumberField label="Cantidad de paneles" value={panels} onChange={setPanels} />

              <StaticField label="Watts por panel" value="410 W" muted />

              <NumberField label="Cantidad de baterías" value={batteries} onChange={setBatteries} />

              

              <NumberField label="EPC de venta manual" value={saleEpc} onChange={setSaleEpc} full step="0.01" placeholder="Ej: 4.20" highlight emptyZero />
              
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg border border-sky-100">
            <div className="mb-5 text-xl font-semibold">Resultados</div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Metric title="kW" value={`${fmtNum(data.kw)} kW`} color="sky" />
                <Metric title="Watts" value={`${fmtNum(data.watts, 0)} W`} color="slate" />
                <Metric title="EPC Base" value={fmtEpc(data.epc)} color="sky" big />
                <Metric title="EPC Venta" value={fmtEpc(data.saleEpc)} color="amber" big />
                <Metric title="Diferencia en comisión" value={fmtMoney(data.extraCommission)} color="amber" />
              </div>

              

              
                  </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function NumberField({ label, value, onChange, full = false, step = "1", placeholder = "", highlight = false, emptyZero = false }) {
  const displayValue = emptyZero && Number(value) === 0 ? "" : value;

  return (
    <div className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type="number"
        step={step}
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        className={[
          "h-12 w-full rounded-2xl border px-4 text-sm outline-none",
          highlight ? "border-2 border-sky-500 bg-sky-50 focus:border-sky-600" : "bg-white focus:border-slate-400",
        ].join(" ")}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, full = false }) {
  return (
    <div className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border bg-white px-4 text-sm outline-none focus:border-slate-400"
      >
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function StaticField({ label, value, full = false, muted = false }) {
  return (
    <div className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className={`flex h-12 items-center rounded-2xl border px-4 text-sm ${muted ? "bg-slate-100 text-slate-700" : "bg-white text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}

function Metric({ title, value, color = "slate", big = false }) {
  const colors = {
    slate: "bg-white text-slate-900 border-slate-200",
    sky: "bg-sky-50 text-sky-900 border-sky-300",
    amber: "bg-amber-50 text-amber-900 border-amber-300",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <div className="text-sm opacity-70">{title}</div>
      <div className={`mt-1 font-semibold ${big ? "text-3xl" : "text-xl"}`}>
        {value}
      </div>
    </div>
  );
}


