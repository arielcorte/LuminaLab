import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Synapse } from "@filoz/synapse-sdk";
import { useEthersSigner } from "./useEthersSigner";

export const useCreateDataset = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const getSigner = useEthersSigner();

  const mutation = useMutation({
    mutationFn: async ({ withCDN }: { withCDN?: boolean } = {}) => {
      if (!getSigner) throw new Error("Wallet not connected");

      const signer = await getSigner();
      if (!signer) throw new Error("Failed to get signer");

      setProgress(0);
      setDatasetId(null);
      setStatus("🔄 Creating dataset...");

      const synapse = await Synapse.create({ signer, withCDN });

      setStatus("🔗 Initializing storage context...");
      setProgress(25);

      const storageContext = await synapse.storage.createContext({
        forceCreateDataSet: true,
        withCDN: withCDN,
        callbacks: {
          onDataSetResolved: (info) => {
            setStatus(`✅ Dataset ${info.dataSetId} created`);
            setDatasetId(info.dataSetId);
            setProgress(100);
          },
          onProviderSelected: (provider) => {
            setStatus("🏪 Provider selected");
            setProgress(50);
          },
        },
      });

      return storageContext.dataSetId;
    },
    onSuccess: () => {
      setStatus("🎉 Dataset created successfully!");
    },
    onError: (error: Error) => {
      console.error("Dataset creation failed:", error);
      setStatus(`❌ Failed: ${error.message}`);
      setProgress(0);
    },
  });

  return { createDatasetMutation: mutation, progress, status, datasetId };
};
