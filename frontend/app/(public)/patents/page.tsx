"use client";

import { OpenCreatePatentInline } from "@/components/patents/OpenCreatePatentInline";
import { PatentCard } from "@/components/patents/PatentCard";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useAllPatents } from "@/hooks/useAllPatents";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

export default function PatentsPage() {
  const [patents, setPatents] = useState<any[]>([]);
  const { ready, authenticated } = usePrivy();

  // Fetch patents from blockchain
  const { patents: patentAddresses, loading } = useAllPatents(CONTRACT_ADDRESSES.FACTORY);

  useEffect(() => {
    // Convert patent addresses to display format
    if (patentAddresses && patentAddresses.length > 0) {
      const formattedPatents = patentAddresses.map((address: string, index: number) => ({
        id: address,
        address,
        // These will be fetched from the individual patent contracts in PatentCard
        title: `Patent ${index + 1}`,
        researcher: "Loading...",
        description: "Loading patent details...",
        tags: [],
      }));
      setPatents(formattedPatents);
    }
  }, [patentAddresses]);

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

        {loading && (
          <p className="text-gray-500 text-center mt-10">Loading patents from blockchain...</p>
        )}

        {!loading && patents.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No patents found. Create the first one!</p>
        )}
      </div>
    </div>
  );
}
