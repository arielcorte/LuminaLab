import { useMutation } from "@tanstack/react-query";
import { Synapse } from "@filoz/synapse-sdk";
import { fileTypeFromBuffer } from "file-type";
import { useEthersSigner } from "./useEthersSigner";

export const useDownloadPiece = (pieceCid: string, filename: string) => {
  const getSigner = useEthersSigner();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!getSigner) throw new Error("Wallet not connected");

      const signer = await getSigner();
      if (!signer) throw new Error("Failed to get signer");

      const synapse = await Synapse.create({ signer });
      const uint8ArrayBytes = await synapse.storage.download(pieceCid);
      const fileType = await fileTypeFromBuffer(uint8ArrayBytes);

      const file = new File([uint8ArrayBytes], filename, {
        type: fileType?.mime,
      });

      // Trigger browser download
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      return file;
    },
    onError: (error: Error) => {
      console.error("Download failed:", error);
    },
  });

  return { downloadMutation: mutation };
};
