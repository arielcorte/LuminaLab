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
    [paramId]
  );

  const [patent, setPatent] = useState<PatentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { authenticated } = usePrivy();
  const router = useRouter();
  const [count, setCount] = useState(5);

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

        const metadata = await fetchPatentMetadata(patentId);
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
          err instanceof Error
            ? err.message
            : "Failed to load patent details."
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
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-xl font-semibold">Login to see this patent!</p>
        <p className="mt-2 text-gray-600">Redirecting to home in {count}...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading patent details...
        </p>
      </div>
    );
  }

  if (error || !patent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          {error ?? "Patent not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      <Card className="w-full max-w-3xl p-10">
        <CardHeader>
          <CardTitle className="text-3xl">{patent.title}</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            By {patent.researcher}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-200">{patent.description}</p>

          <div className="flex flex-wrap gap-2">
            {patent.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <PDFViewer pdfUrl={patent.pdfUrl} />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {patent.ownerAddress && (
              <p className="text-gray-700 dark:text-gray-200">
                Owner address: {patent.ownerAddress}
              </p>
            )}
            <Button>Donate</Button>
            <Button>Invest</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
