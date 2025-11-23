"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFViewer } from "@/components/patents/PDFViewer";
import { usePrivy } from "@privy-io/react-auth";
import { buildPdfUrl, fetchPatentMetadata } from "@/lib/lighthouse";
import { ArrowLeft, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { truncateAddress, copyToClipboard, getExplorerAddressUrl } from "@/lib/format";
import { toast } from "sonner";
import Link from "next/link";

type PatentDetails = {
  title: string;
  researcher: string;
  description: string;
  tags: string[];
  ownerAddress?: string;
  pdfCid: string;
  pdfUrl: string;
};

export default function PatentPage() {
  const params = useParams();
  const paramId = params?.id;
  const patentId = useMemo(
    () => (Array.isArray(paramId) ? paramId[0] : paramId),
    [paramId],
  );

  const [patent, setPatent] = useState<PatentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { authenticated } = usePrivy();
  const router = useRouter();
  const [count, setCount] = useState(5);

  const handleCopyAddress = async () => {
    if (!patent?.ownerAddress) return;

    const success = await copyToClipboard(patent.ownerAddress);
    if (success) {
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy address");
    }
  };

  useEffect(() => {
    if (!authenticated) {
      const interval = setInterval(() => {
        setCount((c) => {
          if (c <= 1) {
            router.push("/");
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [authenticated, router]);

  useEffect(() => {
    if (!authenticated || !patentId) return;

    async function loadPatent() {
      try {
        setLoading(true);
        setError(null);

        const metadata = await fetchPatentMetadata(patentId || "");
        if (!metadata?.pdfCid) {
          throw new Error("Patent metadata is missing the PDF reference.");
        }

        setPatent({
          title: metadata.title,
          description: metadata.description,
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          researcher: metadata.ownerAddress ?? "Unknown researcher",
          ownerAddress: metadata.ownerAddress,
          pdfCid: metadata.pdfCid,
          pdfUrl: buildPdfUrl(metadata.pdfCid),
        });
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load patent details.",
        );
        setPatent(null);
      } finally {
        setLoading(false);
      }
    }

    loadPatent();
  }, [authenticated, patentId]);

  if (!authenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-background">
        <div className="text-center p-8 rounded-xl border border-border bg-card">
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground mb-1">
            Please login to view patent details
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
            Redirecting to home in {count}s...
            <div className="h-2 w-2 rounded-full bg-primary animate-glow" />
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
        </div>
        <p className="text-muted-foreground">
          Loading patent details...
        </p>
      </div>
    );
  }

  if (error || !patent) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-background">
        <div className="text-center max-w-md p-8 rounded-xl border border-border bg-card">
          <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center ring-1 ring-destructive/20">
            <ExternalLink className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Patent Not Found
          </h2>
          <p className="text-destructive mb-6">
            {error ?? "The requested patent could not be found"}
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/patents">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patents
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="w-full px-8 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/patents">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patents
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-8 py-10">
        <Card className="overflow-hidden card-glow border-border/50">
          {/* Header Section */}
          <CardHeader className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border pb-8">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4 gradient-text-blue-purple">
                {patent.title}
              </CardTitle>

              {/* Owner Info */}
              {patent.ownerAddress && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                    <span>Patent Owner</span>
                    <div className="h-1 w-1 rounded-full bg-primary animate-glow" />
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="px-3 py-2 text-sm font-mono bg-muted/50 border border-border rounded-lg ring-1 ring-primary/10">
                      {truncateAddress(patent.ownerAddress)}
                    </code>

                    <button
                      onClick={handleCopyAddress}
                      className="p-2 hover:bg-accent/50 rounded-lg transition-all border border-border ring-1 ring-transparent hover:ring-primary/30"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>

                    <a
                      href={getExplorerAddressUrl(patent.ownerAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent/50 rounded-lg transition-all border border-border ring-1 ring-transparent hover:ring-primary/30"
                      title="View on block explorer"
                    >
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          {/* Content Section */}
          <CardContent className="p-8 space-y-8">
            {/* Tags */}
            {patent.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  Research Areas
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patent.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="px-3 py-1 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                Description
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {patent.description}
              </p>
            </div>

            {/* PDF Viewer */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                Patent Document
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </h3>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
                <PDFViewer pdfUrl={patent.pdfUrl} />
              </div>
            </div>

            {/* Buy Action */}
            <div className="pt-6 border-t flex justify-end">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={`/patents/${patentId}/buy`}>
                  Buy Patent Rights
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
