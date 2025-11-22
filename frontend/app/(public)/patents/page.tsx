"use client";

import { PatentCard } from "@/components/ui/PatentCard";
import { useState, useEffect } from "react";

const MOCK_PATENTS = [
  {
    id: "1",
    title: "Quantum-Resilient Encryption Layer",
    researcher: "Dr. Sofia Martínez",
    description:
      "A lightweight cryptographic layer designed for post-quantum resistance in IoT devices.",
    tags: ["Cryptography", "IoT", "Quantum"],
  },
  {
    id: "2",
    title: "Bio-Reactive Nanocoating for Implants",
    researcher: "Dr. Alex Kim",
    description:
      "A self-healing nanocoating that reduces inflammation around metallic implants.",
    tags: ["Biotech", "Nanotech"],
  },
  {
    id: "3",
    title: "AI-Driven Ocean Plastic Collector",
    researcher: "Ing. Carla Ruiz",
    description:
      "Autonomous surface robots that identify, cluster, and collect microplastics.",
    tags: ["AI", "Robotics", "Environment"],
  },
];

export default function PatentsPage() {
  const [patents, setPatents] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => setPatents(MOCK_PATENTS), 300);
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Available Patents</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Support cutting-edge research through donations or early-stage
        micro-investments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {patents.map((p) => (
          <PatentCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
