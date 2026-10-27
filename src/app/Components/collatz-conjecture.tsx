"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

type Point = { iteration: number; value: number };

const PRESETS = [7, 27, 97, 871, 6171];
const MAX_INPUT = Math.floor(Number.MAX_SAFE_INTEGER / 3);

const collatz = (start: number): Point[] => {
  let value = start;
  let i = 0;
  const points: Point[] = [];

  while (value > 1) {
    points.push({ iteration: i, value });
    value = value % 2 === 0 ? value / 2 : value * 3 + 1;
    i++;
  }
  points.push({ iteration: i, value });
  return points;
};

const formatNumber = (n: number) => n.toLocaleString("de-DE");

const compact = (n: number) =>
  Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

const ChartTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as Point;
  return (
    <div className="border border-stone-300 bg-white px-2.5 py-1.5 text-xs">
      <div className="text-stone-500">Schritt {point.iteration}</div>
      <div className="font-mono text-stone-900">{formatNumber(point.value)}</div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs text-stone-500">{label}</div>
    <div className="font-mono text-lg text-stone-900">{value}</div>
  </div>
);

const CollatzConjecture = () => {
  const [inputValue, setInputValue] = useState("27");
  const [data, setData] = useState<Point[]>(() => collatz(27));
  const [logScale, setLogScale] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const peak = data.reduce((max, p) => (p.value > max.value ? p : max));
    return { start: data[0].value, steps: data.length - 1, peak: peak.value };
  }, [data]);

  const run = (n: number) => {
    if (!Number.isInteger(n) || n <= 0) {
      setError("Bitte eine positive ganze Zahl eingeben.");
      return;
    }
    if (n > MAX_INPUT) {
      setError(`Bitte eine Zahl bis ${formatNumber(MAX_INPUT)} eingeben.`);
      return;
    }
    setError("");
    setInputValue(String(n));
    setData(collatz(n));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(Number(inputValue));
  };

  return (
    <main className="grid w-full grid-cols-1 gap-12 lg:grid-cols-5">
      {/* Left Section - Text and Input */}
      <section className="lg:col-span-2">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-stone-900">
          Collatz-Vermutung
        </h1>

        <p className="mb-4 max-w-md leading-relaxed text-stone-600">
          Man beginnt mit einer beliebigen positiven ganzen Zahl. Ist sie
          gerade, wird sie halbiert. Ist sie ungerade, wird sie mit drei
          multipliziert und eins addiert. Das wiederholt man, bis die Zahl eins
          erreicht.
        </p>

        <p className="mb-4 max-w-md leading-relaxed text-stone-600">
          Die Vermutung besagt, dass dieser Ablauf immer bei eins ankommt, egal
          mit welcher Zahl man startet.
        </p>

        <p className="mb-8 max-w-md leading-relaxed text-stone-600">
          Bewiesen hat das bisher niemand. Computer haben jede Startzahl bis
          über 10<sup>20</sup> geprüft, aber das ist kein Beweis. Die Folgen
          steigen und fallen ohne erkennbares Muster, und niemand kann
          ausschließen, dass es eine Zahl gibt, deren Folge unendlich wächst
          oder in einer anderen Schleife endet.
        </p>

        {/* Input and Button */}
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Zahl eingeben"
              aria-label="Startzahl"
              className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-stone-900 focus:border-stone-900 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              Berechnen
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-stone-500">Beispiele:</span>
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => run(n)}
                className={`font-mono underline-offset-4 hover:underline ${
                  stats.start === n
                    ? "text-stone-900 underline"
                    : "text-stone-500"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Right Section - Graph */}
      <section className="lg:col-span-3">
        <div className="mb-6 flex items-end justify-between gap-6 border-b border-stone-200 pb-4">
          <div className="flex gap-8">
            <Stat label="Start" value={formatNumber(stats.start)} />
            <Stat label="Schritte" value={formatNumber(stats.steps)} />
            <Stat label="Maximum" value={formatNumber(stats.peak)} />
          </div>
          <div className="flex gap-3 text-sm">
            {(["Linear", "Log"] as const).map((label) => {
              const active = (label === "Log") === logScale;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setLogScale(label === "Log")}
                  className={
                    active
                      ? "text-stone-900 underline underline-offset-4"
                      : "text-stone-500 hover:text-stone-900"
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-80 w-full sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid stroke="#e7e5e4" vertical={false} />
              <XAxis
                dataKey="iteration"
                tick={{ fill: "#78716c", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#d6d3d1" }}
                minTickGap={24}
              />
              <YAxis
                scale={logScale ? "log" : "auto"}
                domain={logScale ? [1, "auto"] : [0, "auto"]}
                allowDataOverflow
                tickFormatter={compact}
                tick={{ fill: "#78716c", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#a8a29e", strokeWidth: 1 }}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#1c1917"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#1c1917", strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
};

export default CollatzConjecture;
