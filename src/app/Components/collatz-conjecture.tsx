"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CollatzConjecture = () => {
  const [inputValue, setInputValue] = useState(0);
  const [data, setData] = useState<{ iteration: number; value: number }[]>([
    { iteration: 0, value: 0 },
  ]);
  const [iterations, setIterations] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    if (!inputValue || inputValue <= 0) return; // Ensure valid input
    let value = inputValue;
    let i = 0;
    const updates: { iteration: number; value: number }[] = [];

    while (value > 1) {
      updates.push({ iteration: i, value });
      if (value % 2 === 0) {
        value = value / 2;
      } else {
        value = value * 3 + 1;
      }
      i++;
    }
    updates.push({ iteration: i, value });
    setData(updates);
    setIterations(i);
  };

  // Handle key press (Enter) for submitting
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(); // Trigger submission on Enter key press
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section - Text and Input */}
      <div className="lg:col-span-1 flex flex-col justify-start">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">
          Collatz Conjecture
        </h1>
        <p className="text-lg text-gray-700 max-w-lg mb-6">
          The Collatz Conjecture is a mathematical sequence that starts with any
          positive integer. If the number is even, it is divided by two; if it
          is odd, it is multiplied by three and one is added. The process is
          repeated until the number reaches one. The conjecture is that this
          process will always eventually reach one, regardless of the starting
          number.
        </p>

        {/* Input and Button underneath text */}
        <div className="flex flex-col space-y-4 mb-6">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress} // Add keydown event for Enter key
            placeholder="Enter a number"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Generate Sequence
          </button>
        </div>
      </div>

      {/* Right Section - Graph */}
      <div className="lg:col-span-2 flex items-center justify-center">
        <div className="w-full h-96 max-w-4xl">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 15 }}
              className="bg-white p-4 rounded-lg shadow-lg"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="iteration"
                label={{
                  value: "Iterations",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                label={{
                  value: "Value",
                  position: "insideLeft",
                  offset: -10,
                }}
              />

              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default CollatzConjecture;
