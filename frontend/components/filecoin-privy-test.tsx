"use client";
import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDownloadPiece } from "@/hooks/useDownloadPiece";
// import { useFaucet } from "@/hooks/useFaucet";

export const FileManager = () => {
  const [file, setFile] = useState<File | null>(null);
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const { uploadMutation, progress, status, pieceCid, handleReset } =
    useFileUpload();
  // const { faucetMutation } = useFaucet();

  if (!ready) return <div>Loading...</div>;
  if (!authenticated) {
    return <button onClick={login}>Login with Privy</button>;
  }
  if (wallets.length === 0) return <div>No wallet connected</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Upload File to Filecoin</h2>

      {/* Faucet Button */}
      {/*
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => faucetMutation.mutate()}
          disabled={faucetMutation.isPending}
          style={{ padding: "10px 20px" }}
        >
          {faucetMutation.isPending
            ? "Getting USDFC..."
            : "Get USDFC from Faucet"}
        </button>
        {faucetMutation.isSuccess && (
          <p style={{ color: "green" }}>✅ USDFC received!</p>
        )}
      </div>
      */}

      {/* File Upload */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ marginBottom: "10px" }}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => file && uploadMutation.mutate({ file })}
          disabled={!file || uploadMutation.isPending}
          style={{ padding: "10px 20px" }}
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={() => {
            handleReset();
            setFile(null);
          }}
          disabled={uploadMutation.isPending}
          style={{ padding: "10px 20px" }}
        >
          Reset
        </button>
      </div>

      {/* Status */}
      {status && <p>{status}</p>}

      {/* Progress Bar */}
      {progress > 0 && (
        <div
          style={{
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "green",
              height: "20px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {/* Results */}
      {pieceCid && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Piece CID:</strong> {pieceCid}
          </p>
          <DownloadButton pieceCid={pieceCid} filename={file?.name || "file"} />
        </div>
      )}
    </div>
  );
};

const DownloadButton = ({
  pieceCid,
  filename,
}: {
  pieceCid: string;
  filename: string;
}) => {
  const { downloadMutation } = useDownloadPiece(pieceCid, filename);

  return (
    <button
      onClick={() => downloadMutation.mutate()}
      disabled={downloadMutation.isPending}
      style={{ padding: "10px 20px", marginTop: "10px" }}
    >
      {downloadMutation.isPending ? "Downloading..." : "Download"}
    </button>
  );
};
