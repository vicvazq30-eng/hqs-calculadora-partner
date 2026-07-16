"use client";

import React, { useMemo, useState } from "react";

const WATTS_PER_PANEL = 410;
const SOLAR_EPC = 2.4;
const BATTERY_COST = 12500;
const DIFFERENTIAL_PERCENT = 0.90;

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("es-PR", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

const fmtNum = (n: number, digits = 2) =>
  new Intl.NumberFormat("es-PR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n || 0);

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

    const solarCost = watts * SOLAR_EPC;
    const batteriesCost = batteryCount * BATTERY_COST;
    const systemCost = solarCost + batteriesCost;

    const baseEpc = watts > 0 ? systemCost / watts : 0;

    const commissionDifference =
      (saleEpcValue - baseEpc) * watts * DIFFERENTIAL_PERCENT;

    return {
      watts,
      kw,
      solarCost,
      batteriesCost,
      systemCost,
      baseEpc,
      saleEpc: saleEpcValue,
      commissionDifference,
    };
  }, [panels, batteries, saleEpc]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-amber-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 text-4xl font-bold tracking-wide md:text-5xl">
              <span className="text-amber-500">HQS</span>{" "}
              <span className="text-sky-500">ENERGY</span>
            </div>

            <h1 className="bg-gradient-to-r from-sky-700 to-amber-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Calculadora interna de EPC y comisión
            </h1>

            <p className="mt-1 max-w-3xl text-sm text-slate-600 md:text-base">
              Calcula tamaño del sistema, costo base, EPC base y diferencia de comisión.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md">
            <Shield className="h-4 w-4" />
            <span className="text-sm text-slate-700">Modo visual privado</span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-5 w-5" /> Entradas
              </CardTitle>
              <CardDescription>Programa activo: Sunrun</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Compañía</Label>
                <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-700">
                  Sunrun
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cantidad de paneles</Label>
                <Input
                  className="h-12 rounded-2xl"
                  type="number"
                  min="0"
                  value={panels}
                  onChange={(e) => setPanels(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Watts por panel</Label>
                <div className="flex h-12 items-center rounded-2xl border bg-slate-100 px-4 text-sm text-slate-700">
                  {WATTS_PER_PANEL} W
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cantidad de baterías</Label>
                <Input
                  className="h-12 rounded-2xl"
                  type="number"
                  min="0"
                  value={batteries}
                  onChange={(e) => setBatteries(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Marca de batería</Label>
                <div className="flex h-12 items-center rounded-2xl border bg-slate-100 px-4 text-sm text-slate-700">
                  Tesla
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>EPC de venta</Label>
                <Input
                  className="h-12 rounded-2xl border-2 border-sky-500 bg-sky-50 focus:border-sky-600 focus:ring-sky-500"
                  type="number"
                  min="0"
                  step="0.01"
                  value={saleEpc}
                  onChange={(e) => setSaleEpc(Number(e.target.value))}
                />
                <p className="mt-2 text-xs text-slate-500">Diferencial basado en el 90%.</p>
              </div>

              <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-sky-600 via-cyan-500 to-amber-400 p-5 text-white shadow-2xl shadow-sky-300/30">
                  <div className="text-sm">EPC Base</div>
                  <div className="text-3xl font-bold">{fmtNum(data.baseEpc)}</div>
                </div>

                <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-sky-600 via-cyan-500 to-amber-400 p-5 text-white shadow-2xl shadow-sky-300/30">
                  <div className="text-sm">EPC Venta</div>
                  <div className="text-3xl font-bold">{fmtNum(data.saleEpc)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5" /> Resultados
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Metric title="kW" value={`${fmtNum(data.kw)} kW`} />
                <Metric title="Watts" value={`${fmtNum(data.watts, 0)} W`} />
                <Metric title="Costo solar" value={fmtMoney(data.solarCost)} />
                <Metric title="Costo de baterías" value={fmtMoney(data.batteriesCost)} />
                <Metric title="Costo del sistema" value={fmtMoney(data.systemCost)} />
                <Metric
                  title="Diferencia en comisión"
                  value={fmtMoney(data.commissionDifference)}
                  danger={data.commissionDifference < 0}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        danger ? "border-red-200 bg-red-50" : "bg-slate-50"
      }`}
    >
      <div className={`text-sm ${danger ? "text-red-600" : "text-slate-500"}`}>
        {title}
      </div>
      <div className={`mt-1 text-xl font-semibold ${danger ? "text-red-700" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

function CardHeader({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function CardContent({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function CardTitle({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

function CardDescription({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={`text-sm text-slate-600 ${className}`}>{children}</p>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;

  return (
    <input
      {...rest}
      className={`w-full border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 ${className}`}
    />
  );
}

function Label({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`text-sm font-medium text-slate-700 ${className}`}>
      {children}
    </label>
  );
}

function Shield({ className = "" }: { className?: string }) {
  return <span className={className}>🛡️</span>;
}

function Calculator({ className = "" }: { className?: string }) {
  return <span className={className}>🧮</span>;
}

function TrendingUp({ className = "" }: { className?: string }) {
  return <span className={className}>📈</span>;
}
