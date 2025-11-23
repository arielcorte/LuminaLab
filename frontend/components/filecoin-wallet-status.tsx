// import { Synapse, TOKENS } from "@filoz/synapse-sdk";
// const context = await synapse.storage.createContext({
//   metadata: {
//     Application: "My DApp",
//     Version: "1.0.0",
//     Category: "Documents",
//   },
// });
//
// const result = await synapse.storage.upload(data, { context });
// console.log("Uploaded:", result.pieceCid);

// import { Synapse, TOKENS } from "@filoz/synapse-sdk";
// import { BrowserProvider } from "ethers";
// import { useState } from "react";
// import { ethers } from "ethers";
//
// const SimpleMetaMaskExample = () => {
//   const [synapse, setSynapse] = useState<Synapse | null>(null);
//
//   const connect = async () => {
//     if (!window.ethereum) return alert("Install MetaMask");
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     const provider = new BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     setSynapse(await Synapse.create({ signer }));
//   };
//   const deposit = async () => {
//     if (!synapse) return;
//     const amount = ethers.parseUnits("1", 18);
//     const tx = await synapse.payments.deposit(amount, TOKENS.USDFC);
//     await tx.wait();
//     alert("Deposit confirmed!");
//   };
//
//   return synapse ? (
//     <button onClick={deposit}>Deposit 1 USDFC</button>
//   ) : (
//     <button onClick={connect}>Connect MetaMask</button>
//   );
// };

import React, { useEffect, useState } from "react";
import { PieceCID, Synapse } from "@filoz/synapse-sdk";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { WagmiProvider } from "wagmi";

const FilecoinUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cid, setCid] = useState<PieceCID | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [synapse, setSynapse] = useState<Synapse | null>(null);
  const signer = useEthersSigner();

  useEffect(() => {
    console.log("signing");
    console.log(signer);
    if (signer)
      Synapse.create({ signer }).then(setSynapse).catch(console.error);
  }, [signer]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      // Reset previous states when a new file is selected
      setCid(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!synapse) {
      setError("Synapse can't be null");
      return;
    }
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // 2. Convert to Uint8Array (which satisfies the type requirement)
      const data = new Uint8Array(arrayBuffer);

      // 3. Create context
      const context = await synapse.storage.createContext({
        metadata: {
          Application: "My DApp",
          Version: "1.0.0",
          Category: "Documents",
        },
      });

      // 4. Upload the Uint8Array data
      const result = await synapse.storage.upload(data, { context });

      console.log("Uploaded:", result.pieceCid);
      setCid(result.pieceCid);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "An unknown error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3>Filecoin Storage Upload</h3>

      <div style={{ marginBottom: "10px" }}>
        <input type="file" onChange={handleFileChange} disabled={uploading} />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        {uploading ? "Uploading to Filecoin..." : "Upload"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>
      )}

      {cid && (
        <div
          style={{ marginTop: "20px", padding: "10px", background: "#f0f9ff" }}
        >
          <p style={{ color: "green", fontWeight: "bold" }}>
            Upload Successful!
          </p>
          <p>
            <strong>Piece CID:</strong>
          </p>
          <code style={{ wordBreak: "break-all" }}>{cid.toString()}</code>
        </div>
      )}
    </div>
  );
};

export default FilecoinUploader;
