import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Utility to pick random result
const spinTo = (options: string[]) => {
  const index = Math.floor(Math.random() * options.length);
  return { result: options[index], index };
};

export default function WheelApp() {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [pointerRotation, setPointerRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const addOption = () => {
    if (inputValue.trim() !== "") {
      setOptions([...options, inputValue.trim()]);
      setInputValue("");
    }
  };

  const spin = () => {
    if (options.length === 0 || isSpinning) return;

    const { result, index } = spinTo(options);
    const degreesPerSlice = 360 / options.length;
    const sliceCenter = degreesPerSlice * index + degreesPerSlice / 2;

    const extraSpins = 5 * 360;
    const finalRotation = extraSpins + sliceCenter + Math.random() * 20 - 10;

    setIsSpinning(true);
    setPointerRotation(finalRotation);

    setTimeout(() => {
      setResult(result);
      setHistory((h) => [...h, result]);
      setOptions((prev) => prev.filter((o) => o !== result));
      setIsSpinning(false);
    }, 3500);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex gap-4 mb-4">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Новий варіант"
          className="border rounded-xl px-3 py-2"
        />
        <Button onClick={addOption}>Додати</Button>
        <Button variant="secondary" onClick={() => setHistory([])}>Очистити історію</Button>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Wheel */}
        <svg width="320" height="320" viewBox="0 0 320 320" className="z-0">
          <g transform="translate(160,160)">
            {options.map((opt, i) => {
              const angle = (360 / options.length) * i;
              const largeArc = 360 / options.length > 180 ? 1 : 0;
              const x1 = 0;
              const y1 = 0;
              const radius = 150;

              const x2 = radius * Math.cos((Math.PI / 180) * angle);
              const y2 = radius * Math.sin((Math.PI / 180) * angle);
              const x3 = radius * Math.cos((Math.PI / 180) * (angle + 360 / options.length));
              const y3 = radius * Math.sin((Math.PI / 180) * (angle + 360 / options.length));

              return (
                <g key={i}>
                  <path
                    d={`M${x1},${y1} L${x2},${y2} A${radius},${radius} 0 ${largeArc} 1 ${x3},${y3} Z`}
                    fill={`hsl(${(i * 50) % 360}, 70%, 60%)`}
                  />
                  <text
                    transform={`rotate(${angle + (360 / options.length) / 2}) translate(90,5)`}
                    textAnchor="middle"
                    fontSize="14"
                    fill="#000"
                  >
                    {opt}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Pointer */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500"
          animate={{ rotate: pointerRotation }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
        />
      </div>

      <Button onClick={spin} disabled={isSpinning || options.length === 0} className="mt-4 text-lg px-6 py-3">
        Крутити
      </Button>

      {/* HISTORY */}
      <Card className="w-full mt-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Історія результатів</h2>
          <ul className="list-disc ml-5">
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* RESULT MODAL */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Результат</h2>
              <p className="text-2xl font-bold mb-6">{result}</p>
              <Button onClick={() => setResult(null)}>Далі</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
