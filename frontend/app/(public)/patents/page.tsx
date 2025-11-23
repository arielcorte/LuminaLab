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
    <div className="flex flex-col justify-start items-center py-12 px-6 w-full min-h-screen">
      <div className="w-full max-w-5xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-center">
          Available Patents
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-300">
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

        {error && <p className="mb-6 text-center text-red-500">{error}</p>}

        {/* GRID */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
          {patents.map((p) => (
            <PatentCard key={p.id} {...p} />
          ))}
        </div>

        {loading && (
          <p className="mt-10 text-center text-gray-500">
            Loading patents from blockchain...
          </p>
        )}

        {!loading && patents.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            No patents found. Create the first one!
          </p>
        )}

        {!loading && patents.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            No patents found. Be the first to upload one!
          </p>
        )}
      </div>
    </div>
  );
}
