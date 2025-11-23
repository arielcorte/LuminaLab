"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PatentMetadataRecord,
  buildPdfUrl,
  listPatentMetadata,
} from "@/lib/lighthouse";

export type PatentSummary = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  researcher: string;
  pdfCid: string;
  pdfUrl: string;
  createdAt: string;
};

const mapRecordToSummary = (
  record: PatentMetadataRecord
): PatentSummary | null => {
  const { metadata, cid } = record;

  if (!metadata?.title || !metadata?.description || !metadata?.pdfCid) {
    return null;
  }

  return {
    id: cid,
    title: metadata.title,
    description: metadata.description,
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    researcher: metadata.ownerAddress ?? "Unknown researcher",
    pdfCid: metadata.pdfCid,
    pdfUrl: buildPdfUrl(metadata.pdfCid),
    createdAt: metadata.createdAt,
  };
};

export function useLighthousePatents(refreshKey?: string) {
  const [patents, setPatents] = useState<PatentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const records: PatentMetadataRecord[] = await listPatentMetadata();

      const summaries = records
        .map(mapRecordToSummary)
        .filter((summary): summary is PatentSummary => summary !== null);

      setPatents(summaries);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to load patents."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatents();
  }, [loadPatents, refreshKey]);

  return { patents, loading, error, reload: loadPatents };
}


