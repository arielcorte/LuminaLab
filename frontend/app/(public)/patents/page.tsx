"use client";

import { OpenCreatePatentInline } from "@/components/patents/OpenCreatePatentInline";
import { PatentCard } from "@/components/patents/PatentCard";
import { usePrivy } from "@privy-io/react-auth";
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
  {
    id: "4",
    title: "Quantum-Resilient Encryption Layer",
    researcher: "Dr. Sofia Martínez",
    description:
      "A lightweight cryptographic layer designed for post-quantum resistance in IoT devices.",
    tags: ["Cryptography", "IoT", "Quantum"],
  },
  {
    id: "5",
    title: "Bio-Reactive Nanocoating for Implants",
    researcher: "Dr. Alex Kim",
    description:
      "A self-healing nanocoating that reduces inflammation around metallic implants.",
    tags: ["Biotech", "Nanotech"],
  },
  {
    id: "6",
    title: "AI-Driven Ocean Plastic Collector",
    researcher: "Ing. Carla Ruiz",
    description:
      "Autonomous surface robots that identify, cluster, and collect microplastics.",
    tags: ["AI", "Robotics", "Environment"],
  },
];

export default function PatentsPage() {
  const [patents, setPatents] = useState<any[]>([]);
  const { ready, authenticated} = usePrivy();


  useEffect(() => {
    // Simulación de fetch
    setTimeout(() => setPatents(MOCK_PATENTS), 300);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-12 px-6">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-center">
          Available Patents
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-center mb-10 max-w-2xl mx-auto">
          Support cutting-edge research through donations or early-stage
          micro-investments.
        </p>
        {authenticated && (
        <div className="m-4">
          <OpenCreatePatentInline />
        </div>
        )}

        {/* GRID */}
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-8 
            animate-fadeIn
          "
        >
          {patents.map((p) => (
            <PatentCard key={p.id} {...p} />
          ))}
        </div>

        {patents.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Loading patents...</p>
        )}
      </div>
    </div>
  );
}
