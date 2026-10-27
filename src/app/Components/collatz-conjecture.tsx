"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
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

const formatNumber = (n: number) => n.toLocaleString("en-US");

const compact = (n: number) =>
  Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

const ChartTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as Point;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <div className="text-zinc-400">Step {point.iteration}</div>
      <div className="font-mono text-sm font-semibold text-white">
        {formatNumber(point.value)}
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <div className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
      {label}
    </div>
    <div className="mt-1 truncate font-mono text-xl font-semibold text-white">
      {value}
    </div>
  </div>
);

const CollatzConjecture = () => {
  const [inputValue, setInputValue] = useState("27");
  const [data, setData] = useState<Point[]>(() => collatz(27));
  const [logScale, setLogScale] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const peak = data.reduce((max, p) => (p.value > max.value ? p : max));
    return { start: data[0].value, steps: data.length - 1, peak };
  }, [data]);

  const run = (n: number) => {
    if (!Number.isInteger(n) || n <= 0) {
      setError("Please enter a positive whole number.");
      return;
    }
    if (n > MAX_INPUT) {
      setError(`Please enter a number up to ${compact(MAX_INPUT)}.`);
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
    <main className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-12">
      {/* Left Section - Text and Input */}
      <section className="flex flex-col lg:col-span-2">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
          Unsolved since 1937
        </span>

        <h1 className="mb-6 text-5xl font-semibold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-br from-white via-violet-200 to-fuchsia-400 bg-clip-text text-transparent">
            Collatz
          </span>
          <br />
          <span className="text-zinc-400">Conjecture</span>
        </h1>

        <p className="mb-4 max-w-lg text-base leading-relaxed text-zinc-400">
          Start with any positive integer. If it is{" "}
          <span className="text-zinc-200">even</span>, divide it by two. If it
          is <span className="text-zinc-200">odd</span>, multiply it by three
          and add one. Repeat until the number reaches one.
        </p>

        <div className="mb-6 flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-zinc-300">
          <span>
            n → <span className="text-cyan-300">n / 2</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span>
            n → <span className="text-fuchsia-300">3n + 1</span>
          </span>
        </div>

        <p className="mb-8 max-w-lg text-base leading-relaxed text-zinc-400">
          The conjecture claims this process always eventually reaches one,
          regardless of the starting number.
        </p>

        {/* Input and Button */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur transition focus-within:border-violet-400/50 focus-within:ring-4 focus-within:ring-violet-500/10">
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a number"
              aria-label="Starting number"
              className="min-w-0 flex-1 bg-transparent px-3 font-mono text-lg text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Generate
            </button>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500">Try</span>
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => run(n)}
                className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                  stats.start === n
                    ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Right Section - Graph */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6 lg:col-span-3">
        <div className="mb-4 grid grid-cols-3 gap-3">
          <Stat label="Start" value={formatNumber(stats.start)} />
          <Stat label="Steps" value={formatNumber(stats.steps)} />
          <Stat label="Peak" value={compact(stats.peak.value)} />
        </div>

        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-medium text-zinc-300">
            Trajectory of{" "}
            <span className="font-mono text-white">
              {formatNumber(stats.start)}
            </span>
          </h2>
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs">
            {(["Linear", "Log"] as const).map((label) => {
              const active = (label === "Log") === logScale;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setLogScale(label === "Log")}
                  className={`rounded-md px-2.5 py-1 transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-80 w-full sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 12, left: 0, bottom: 4 }}
            >
              <defs>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="iteration"
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                minTickGap={24}
              />
              <YAxis
                scale={logScale ? "log" : "auto"}
                domain={logScale ? [1, "auto"] : [0, "auto"]}
                allowDataOverflow
                tickFormatter={compact}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
              />
              <Area
                key={`${stats.start}-${logScale}`}
                type="monotone"
                dataKey="value"
                stroke="url(#strokeGradient)"
                strokeWidth={2.5}
                fill="url(#fillGradient)"
                baseValue={logScale ? 1 : 0}
                activeDot={{
                  r: 5,
                  fill: "#fff",
                  stroke: "#a78bfa",
                  strokeWidth: 3,
                }}
                animationDuration={900}
              />
              <ReferenceDot
                x={stats.peak.iteration}
                y={stats.peak.value}
                r={5}
                fill="#e879f9"
                stroke="#fff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
};

export default CollatzConjecture;
