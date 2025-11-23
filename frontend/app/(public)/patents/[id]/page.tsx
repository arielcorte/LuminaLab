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
      <div className="flex flex-col justify-center items-center min-h-screen px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Please login to view patent details
          </p>
          <p className="text-sm text-gray-500">Redirecting to home in {count}s...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Loading patent details...
        </p>
      </div>
    );
  }

  if (error || !patent) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Patent Not Found
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6">
            {error ?? "The requested patent could not be found"}
          </p>
          <Button asChild>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
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
        <Card className="overflow-hidden">
          {/* Header Section */}
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b pb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              {patent.title}
            </CardTitle>

            {/* Owner Info */}
            {patent.ownerAddress && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Patent Owner
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border rounded-lg">
                    {truncateAddress(patent.ownerAddress)}
                  </code>

                  <button
                    onClick={handleCopyAddress}
                    className="p-2 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors border"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  <a
                    href={getExplorerAddressUrl(patent.ownerAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors border"
                    title="View on block explorer"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </a>
                </div>
              </div>
            )}
          </CardHeader>

          {/* Content Section */}
          <CardContent className="p-8 space-y-6">
            {/* Tags */}
            {patent.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Research Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patent.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {patent.description}
              </p>
            </div>

            {/* PDF Viewer */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Patent Document
              </h3>
              <PDFViewer pdfUrl={patent.pdfUrl} />
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
