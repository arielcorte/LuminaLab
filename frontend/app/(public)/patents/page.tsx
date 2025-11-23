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
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-50 grid-bg" />
        <div className="relative py-16 px-8 w-full">
          <div className="flex gap-3 justify-center items-center mb-4">
            <div className="p-2 rounded-xl ring-1 bg-primary/10 ring-primary/20">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h1 className="pb-2 text-5xl font-bold tracking-tight gradient-text-blue-purple">
              Patent Registry
            </h1>
          </div>

          <p className="mx-auto max-w-2xl text-lg text-center text-muted-foreground">
            Explore innovative research and scientific breakthroughs stored on
            the blockchain
          </p>

          {authenticated && (
            <div className="flex justify-center mt-8">
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
      <div className="py-12 px-8 w-full">
        {error && (
          <div className="p-4 mb-8 rounded-lg border bg-destructive/10 border-destructive/30">
            <p className="font-medium text-center text-destructive">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <Loader2 className="mb-4 w-12 h-12 animate-spin text-primary" />
              <div className="absolute inset-0 animate-pulse blur-xl bg-primary/30" />
            </div>
            <p className="text-muted-foreground">
              Loading patents from blockchain...
            </p>
          </div>
        )}

        {/* Patents Grid */}
        {!loading && patents.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Available Patents
              </h2>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">
                  {patents.length} {patents.length === 1 ? "patent" : "patents"}{" "}
                  found
                </span>
                <div className="w-2 h-2 rounded-full bg-primary animate-glow" />
              </div>
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
          <div className="flex flex-col justify-center items-center py-20">
            <div className="flex justify-center items-center mb-6 w-20 h-20 rounded-full ring-1 bg-muted ring-border">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No Patents Yet
            </h3>
            <p className="max-w-md text-center text-muted-foreground">
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
