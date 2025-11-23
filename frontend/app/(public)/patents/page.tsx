"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { OpenCreatePatentInline } from "@/components/patents/OpenCreatePatentInline";
import { PatentCard } from "@/components/patents/PatentCard";
import { useLighthousePatents } from "@/hooks/useLighthousePatents";
import { FileText, Loader2 } from "lucide-react";

export default function PatentsPage() {
  const [refreshKey, setRefreshKey] = useState<string>();
  const { authenticated } = usePrivy();
  const { patents, loading, error } = useLighthousePatents(refreshKey);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="w-full px-8 py-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Patent Registry
            </h1>
          </div>

          <p className="mx-auto max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300">
            Explore innovative research and scientific breakthroughs stored on the blockchain
          </p>

          {authenticated && (
            <div className="mt-8 flex justify-center">
              <OpenCreatePatentInline
                onCreated={(cid) => {
                  setRefreshKey(cid);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-center text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading patents from blockchain...
            </p>
          </div>
        )}

        {/* Patents Grid */}
        {!loading && patents.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Available Patents
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {patents.length} {patents.length === 1 ? "patent" : "patents"} found
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 animate-fadeIn">
              {patents.map((p) => (
                <PatentCard key={p.id} {...p} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && patents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Patents Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {authenticated
                ? "Be the first to upload a patent to the registry!"
                : "No patents have been uploaded yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
