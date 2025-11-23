import lighthouse from "@lighthouse-web3/sdk";

const LIGHTHOUSE_API_KEY = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
const METADATA_PREFIX = "patent-metadata";
const GATEWAY_BASE_URL = "https://gateway.lighthouse.storage/ipfs";

if (!LIGHTHOUSE_API_KEY) {
  console.warn(
    "NEXT_PUBLIC_LIGHTHOUSE_API_KEY is not defined. Patent storage calls will fail until it is set."
  );
}

export const buildGatewayUrl = (cid: string) =>
  `${GATEWAY_BASE_URL}/${cid}`;

export type PatentMetadata = {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  ownerAddress?: string;
  pdfCid: string;
  pdfName?: string;
  pdfMimeType?: string;
  createdAt: string;
  [extra: string]: unknown;
};

export type PatentUploadRequest = {
  pdfFile: File;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  ownerAddress?: string;
};

export type PatentUploadResult = {
  metadataCid: string;
  metadataFileName: string;
  pdfCid: string;
  pdfFileName: string;
  metadata: PatentMetadata;
};

function assertApiKey(): string {
  if (!LIGHTHOUSE_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_LIGHTHOUSE_API_KEY env variable.");
  }
  return LIGHTHOUSE_API_KEY;
}

export async function uploadPatent({
  pdfFile,
  title,
  description,
  tags,
  isPublic,
  ownerAddress,
}: PatentUploadRequest): Promise<PatentUploadResult> {
  const apiKey = assertApiKey();
  const pdfResponse = await lighthouse.upload([pdfFile], apiKey);
  const pdfCid = pdfResponse?.data?.Hash;
  const pdfFileName = pdfResponse?.data?.Name ?? pdfFile.name;

  if (!pdfCid) {
    throw new Error("Failed to upload PDF to Lighthouse.");
  }

  const metadata: PatentMetadata = {
    title,
    description,
    tags,
    isPublic,
    ownerAddress,
    pdfCid,
    pdfName: pdfFileName,
    pdfMimeType: pdfFile.type,
    createdAt: new Date().toISOString(),
  };

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const metadataFile = new File(
    [metadataBlob],
    `${METADATA_PREFIX}-${Date.now()}.json`,
    {
      type: "application/json",
    }
  );

  const metadataResponse = await lighthouse.upload([metadataFile], apiKey);
  const metadataCid = metadataResponse?.data?.Hash;
  const metadataFileName =
    metadataResponse?.data?.Name ?? `${METADATA_PREFIX}.json`;

  if (!metadataCid) {
    throw new Error("Failed to upload patent metadata to Lighthouse.");
  }

  return {
    metadataCid,
    metadataFileName,
    pdfCid,
    pdfFileName,
    metadata,
  };
}

export type LighthouseUploadRecord = {
  id: string;
  fileName: string;
  mimeType: string;
  cid: string;
  fileSizeInBytes: string;
  createdAt: number;
  [extra: string]: unknown;
};

export type PatentMetadataRecord = {
  cid: string;
  fileName: string;
  createdAt: number;
  metadata: PatentMetadata;
};

const isPatentMetadataUpload = (entry: LighthouseUploadRecord) =>
  entry.mimeType === "application/json" &&
  entry.fileName?.startsWith(METADATA_PREFIX);

export async function listPatentMetadata(
  lastKey: string | null = null
): Promise<PatentMetadataRecord[]> {
  const apiKey = assertApiKey();
  const response = await lighthouse.getUploads(apiKey, lastKey);
  const fileList: LighthouseUploadRecord[] =
    response?.data?.fileList ?? response?.data ?? [];

  const metadataEntries = fileList.filter(isPatentMetadataUpload);

  const records: PatentMetadataRecord[] = [];

  for (const entry of metadataEntries) {
    try {
      const metadata = await fetchPatentMetadata(entry.cid);
      records.push({
        cid: entry.cid,
        fileName: entry.fileName,
        createdAt: entry.createdAt,
        metadata,
      });
    } catch (error) {
      console.error(`Failed to fetch metadata for CID ${entry.cid}`, error);
    }
  }

  // Sort newest first by createdAt; fallback to metadata.createdAt
  return records.sort((a, b) => {
    const left =
      a.createdAt || new Date(a.metadata.createdAt || 0).getTime();
    const right =
      b.createdAt || new Date(b.metadata.createdAt || 0).getTime();
    return right - left;
  });
}

export async function fetchPatentMetadata(cid: string) {
  const res = await fetch(buildGatewayUrl(cid));
  if (!res.ok) {
    throw new Error(`Failed to fetch metadata for cid ${cid}`);
  }
  const metadata = (await res.json()) as PatentMetadata;
  return metadata;
}

export function buildPdfUrl(pdfCid: string) {
  return buildGatewayUrl(pdfCid);
}


