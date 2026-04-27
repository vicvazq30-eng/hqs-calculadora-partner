"use client";
import React, { useMemo, useState } from "react";

const WATTS_PER_PANEL = 410;
const EPC_RATE = 2.4;
const BATTERY_PRICE = 12500;

const ROLE_RATES = {
  trainee: 0.06,
  consultor: 0.1,
  lider: 0.11,
  gerente: 0.12,
  partner: 0.14,
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-PR", { style: "currency", currency: "USD" }).format(Number.isFinite(n) ? n : 0);

const fmtNum = (n: number, d = 2) =>
  new Intl.NumberFormat("es-PR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(Number.isFinite(n) ? n : 0);

const fmtEpc = (n: number) => {
  if (!Number.isFinite(n)) return "0.00";
  const fixed = n.toFixed(2).replace(".", "");
  return `${fixed[0]}.${fixed.slice(1, 3)}`;
};

export default function HQSCalculadoraPartner() {
  const [panels, setPanels] = useState(32);
  const [batteries, setBatteries] = useState(2);
  const [role] = useState<keyof typeof ROLE_RATES>("consultor");
  const [saleEpc, setSaleEpc] = useState(0);

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

    const epc = watts > 0 ? total / watts : 0;
    const commission = total * roleRate;

    const saleEpcFinal = saleEpcValue > 0 ? saleEpcValue : epc;

    // Toda la diferencia entre EPC base y EPC venta va completa al vendedor
    const extraCommission = Math.max(saleEpcFinal - epc, 0) * watts;

    return {
      watts,
      kw,
      epc,
      saleEpc: saleEpcFinal,
      extraCommission,
    };
  }, [panels, batteries, role, saleEpc]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3faff 0%, #ffffff 55%, #fff8ef 100%)",
        padding: "32px 20px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 12, lineHeight: 1 }}>
              <span style={{ color: "#f59e0b" }}>HQS</span>{" "}
              <span style={{ color: "#0ea5e9" }}>ENERGY</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 44, fontWeight: 800, lineHeight: 1.1 }}>
              HQS Calculadora Partner
            </h1>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              padding: "14px 18px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              fontSize: 14,
              color: "#334155",
            }}
          >
            Modo visual privado
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.1fr) minmax(320px, 0.9fr)",
            gap: 24,
          }}
        >
          <section style={cardStyle}>
            <div style={sectionTitle}>Entradas</div>
            <div style={grid2}>
              <StaticField label="Compañía" value="Sunrun" full />
              <NumberField label="Cantidad de paneles" value={panels} onChange={setPanels} />
              <StaticField label="Watts por panel" value="410 W" muted />
              <NumberField label="Cantidad de baterías" value={batteries} onChange={setBatteries} />
              <NumberField
                label="EPC de venta manual"
                value={saleEpc}
                onChange={setSaleEpc}
                full
                step="0.01"
                placeholder="Ej: 4.20"
                highlight
                emptyZero
              />
            </div>
          </section>

          <section style={cardStyle}>
            <div style={sectionTitle}>Resultados</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Metric title="kW" value={`${fmtNum(data.kw)} kW`} tone="sky" />
              <Metric title="Watts" value={`${fmtNum(data.watts, 0)} W`} tone="neutral" />
              <Metric title="Costo del sistema" value={fmtMoney((Number(panels) || 0) * WATTS_PER_PANEL * EPC_RATE + (Number(batteries) || 0) * BATTERY_PRICE)} tone="neutral" full />
              <Metric title="EPC Base" value={fmtEpc(data.epc)} tone="sky" big />
              <Metric title="EPC Venta" value={fmtEpc(data.saleEpc)} tone="amber" big />
              <Metric title="Diferencia en comisión" value={fmtMoney(data.extraCommission)} tone="amber" full />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function NumberField({
  label,
  value,
  onChange,
  full = false,
  step = "1",
  placeholder = "",
  highlight = false,
  emptyZero = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  full?: boolean;
  step?: string;
  placeholder?: string;
  highlight?: boolean;
  emptyZero?: boolean;
}) {
  const displayValue = emptyZero && Number(value) === 0 ? "" : value;

  return (
    <div style={{ ...fieldWrap, gridColumn: full ? "1 / -1" : undefined }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        step={step}
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          ...inputStyle,
          border: highlight ? "2px solid #0ea5e9" : "1px solid #cbd5e1",
          background: highlight ? "#eff6ff" : "#ffffff",
        }}
      />
    </div>
  );
}

function StaticField({
  label,
  value,
  full = false,
  muted = false,
}: {
  label: string;
  value: string;
  full?: boolean;
  muted?: boolean;
}) {
  return (
    <div style={{ ...fieldWrap, gridColumn: full ? "1 / -1" : undefined }}>
      <div style={labelStyle}>{label}</div>
      <div
        style={{
          ...inputStyle,
          display: "flex",
          alignItems: "center",
          background: muted ? "#f8fafc" : "#ffffff",
          color: muted ? "#334155" : "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  tone = "neutral",
  big = false,
  full = false,
}: {
  title: string;
  value: string;
  tone?: "neutral" | "sky" | "amber";
  big?: boolean;
  full?: boolean;
}) {
  const toneStyles = {
    neutral: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      title: "#64748b",
      value: "#0f172a",
    },
    sky: {
      background: "#eff6ff",
      border: "1px solid #93c5fd",
      title: "#0369a1",
      value: "#0c4a6e",
    },
    amber: {
      background: "#fffbeb",
      border: "1px solid #fcd34d",
      title: "#b45309",
      value: "#92400e",
    },
  };

  const s = toneStyles[tone];

  return (
    <div
      style={{
        gridColumn: full ? "1 / -1" : undefined,
        borderRadius: 18,
        padding: 16,
        background: s.background,
        border: s.border,
      }}
    >
      <div style={{ fontSize: 14, color: s.title, marginBottom: 6, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: big ? 34 : 24, fontWeight: 800, color: s.value }}>{value}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
  border: "1px solid #e2e8f0",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  marginBottom: 18,
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const fieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#334155",
};

const inputStyle: React.CSSProperties = {
  height: 48,
  width: "100%",
  borderRadius: 16,
  padding: "0 14px",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};
