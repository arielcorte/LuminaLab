"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { OpenCreatePatentInline } from "@/components/patents/OpenCreatePatentInline";
import { PatentCard } from "@/components/patents/PatentCard";
import { useLighthousePatents } from "@/hooks/useLighthousePatents";

export default function PatentsPage() {
  const [refreshKey, setRefreshKey] = useState<string>();
  const { authenticated } = usePrivy();
  const { patents, loading, error } = useLighthousePatents(refreshKey);

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
          <OpenCreatePatentInline
            onCreated={(cid) => {
              setRefreshKey(cid);
            }}
          />
        </div>
        )}

        {error && (
          <p className="text-red-500 text-center mb-6">
            {error}
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {patents.map((p) => (
            <PatentCard key={p.id} {...p} />
          ))}
        </div>

        {loading && (
          <p className="text-gray-500 text-center mt-10">Loading patents...</p>
        )}

        {!loading && patents.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No patents found. Be the first to upload one!
          </p>
        )}
      </div>
    </div>
  );
}
