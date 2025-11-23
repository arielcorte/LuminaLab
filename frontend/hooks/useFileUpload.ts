import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Synapse, TOKENS } from "@filoz/synapse-sdk";
import { useEthersSigner } from "./useEthersSigner";
import { usePayment } from "./usePayment";
import { calculateStorageMetrics } from "@/utils/calculateStorageMetrics";

const DEFAULT_CONFIG = {
  storageCapacity: 150, // GB
  persistencePeriod: 365, // days
  minDaysThreshold: 50,
};

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [pieceCid, setPieceCid] = useState<string | null>(null);
  const getSigner = useEthersSigner();
  const { mutation: paymentMutation } = usePayment();

  const mutation = useMutation({
    mutationFn: async ({
      file,
      datasetId,
    }: {
      file: File;
      datasetId?: string;
    }) => {
      if (!getSigner) throw new Error("Wallet not connected");

      const signer = await getSigner();
      if (!signer) throw new Error("Failed to get signer");

      setProgress(0);
      setPieceCid(null);
      setStatus("🔄 Initializing upload...");

      const arrayBuffer = await file.arrayBuffer();
      const uint8ArrayBytes = new Uint8Array(arrayBuffer);

      const synapse = await Synapse.create({ signer });

      // Check USDFC balance first
      setStatus("💰 Checking wallet balance...");
      const usdfcBalance = await synapse.payments.walletBalance(TOKENS.USDFC);
      console.log("USDFC Balance:", usdfcBalance.toString());

      if (usdfcBalance === 0n) {
        throw new Error(
          "No USDFC tokens in wallet. Please get USDFC tokens from the faucet first.",
        );
      }

      // Check storage allowances
      setStatus("💰 Checking storage allowances...");
      setProgress(5);

      const metrics = await calculateStorageMetrics(
        synapse,
        DEFAULT_CONFIG,
        file.size,
      );

      console.log("Storage metrics:", metrics);

      // Setup allowances if insufficient
      if (!metrics.isSufficient) {
        setStatus("⚙️ Setting up storage allowances...");
        console.log("Deposit needed:", metrics.depositNeeded.toString());

        if (metrics.depositNeeded > usdfcBalance) {
          throw new Error(
            `Insufficient USDFC. Need ${metrics.depositNeeded.toString()} but have ${usdfcBalance.toString()}`,
          );
        }

        await paymentMutation.mutateAsync({
          depositAmount: metrics.depositNeeded,
        });

        setStatus("✅ Storage allowances configured");

        // Wait a bit for the transaction to be indexed
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      setStatus("🔗 Creating storage context...");
      setProgress(25);

      const storageService = await synapse.storage.createContext({
        dataSetId: datasetId ? parseInt(datasetId) : undefined,
        callbacks: {
          onDataSetResolved: (info) => {
            console.log("Dataset resolved:", info);
            setStatus("🔗 Dataset resolved");
            setProgress(30);
          },
          onProviderSelected: (provider) => {
            console.log("Provider selected:", provider);
            setStatus("🏪 Storage provider selected");
          },
        },
      });

      setStatus("📁 Uploading file to storage provider...");
      setProgress(55);

      const { pieceCid: cid } = await storageService.upload(uint8ArrayBytes, {
        metadata: { fileName: file.name, fileSize: file.size.toString() },
        onUploadComplete: (piece) => {
          console.log("Upload complete:", piece);
          setStatus("📊 Upload complete! Adding to dataset...");
          setProgress(80);
        },
        onPieceAdded: (hash) => {
          console.log("Piece added, tx hash:", hash);
          setStatus(`🔄 Confirming transaction: ${hash.slice(0, 10)}...`);
        },
        onPieceConfirmed: () => {
          console.log("Piece confirmed");
          setStatus("✅ Confirmed on chain");
          setProgress(100);
        },
      });

      setPieceCid(cid.toV1().toString());
      return cid;
    },
    onSuccess: () => {
      setStatus("🎉 Upload successful!");
    },
    onError: (error: Error) => {
      console.error("Upload failed:", error);
      setStatus(`❌ Upload failed: ${error.message}`);
      setProgress(0);
    },
  });

  const handleReset = () => {
    setProgress(0);
    setPieceCid(null);
    setStatus("");
  };

  return {
    uploadMutation: mutation,
    progress,
    status,
    pieceCid,
    handleReset,
  };
};
