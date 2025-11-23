"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreatePatent } from "@/hooks/useCreatePatent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TransactionStatus } from "@/components/blockchain/TransactionStatus";
import { getUserFriendlyError } from "@/lib/errors";
import { isValidHash } from "@/lib/format";

export default function CreatePatentForm() {
  const [patentLink, setPatentLink] = useState("");
  const [patentHash, setPatentHash] = useState("");
  const [royaltiesSessionLink, setRoyaltiesSessionLink] = useState("");
  const [royaltiesSessionHash, setRoyaltiesSessionHash] = useState("");
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { createPatent, isLoading, error, patentAddress } = useCreatePatent();
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!patentLink.trim()) {
      errors.patentLink = "Patent link is required";
    } else if (!patentLink.startsWith("ipfs://") && !patentLink.startsWith("http")) {
      errors.patentLink = "Please enter a valid IPFS or HTTP URL";
    }

    if (!patentHash.trim()) {
      errors.patentHash = "Patent hash is required";
    } else if (!isValidHash(patentHash)) {
      errors.patentHash = "Invalid hash format. Must be 0x followed by 64 hex characters";
    }

    if (!royaltiesSessionLink.trim()) {
      errors.royaltiesSessionLink = "Royalties session link is required";
    }

    if (!royaltiesSessionHash.trim()) {
      errors.royaltiesSessionHash = "Royalties session hash is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setTxStatus("pending");
    toast.info("Please confirm the transaction in your wallet");

    try {
      // Create patent on blockchain
      const result = await createPatent({
        patentLink,
        patentHash,
        royaltiesSessionLink,
        royaltiesSessionHash,
      });

      if (result.success) {
        setTxHash(result.transactionHash);
        setTxStatus("success");
        toast.success("Patent created successfully!", {
          description: "Redirecting to your new patent...",
        });

        // Redirect after a short delay
        setTimeout(() => {
          if (result.patentAddress) {
            router.push(`/patents/${result.patentAddress}`);
          }
        }, 2000);
      } else {
        setTxStatus("error");
        const friendlyError = getUserFriendlyError(result.error);
        toast.error(friendlyError.title, {
          description: friendlyError.message,
        });
      }
    } catch (err) {
      setTxStatus("error");
      const friendlyError = getUserFriendlyError(err);
      toast.error(friendlyError.title, {
        description: friendlyError.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 animate-fadeIn">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Create New Patent</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Upload your patent document to IPFS/Filecoin first, then provide the details below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="patentLink">Patent Document Link (IPFS/Filecoin URI) *</Label>
                <Input
                  id="patentLink"
                  placeholder="e.g. ipfs://QmXxx... or https://..."
                  value={patentLink}
                  onChange={(e) => {
                    setPatentLink(e.target.value);
                    if (validationErrors.patentLink) {
                      setValidationErrors((prev) => ({ ...prev, patentLink: "" }));
                    }
                  }}
                  className={validationErrors.patentLink ? "border-red-500" : ""}
                />
                {validationErrors.patentLink ? (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.patentLink}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your PDF to IPFS/Filecoin and paste the link here
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="patentHash">Patent Document Hash (SHA256) *</Label>
                <Input
                  id="patentHash"
                  placeholder="0x... (64 hex characters)"
                  value={patentHash}
                  onChange={(e) => {
                    setPatentHash(e.target.value);
                    if (validationErrors.patentHash) {
                      setValidationErrors((prev) => ({ ...prev, patentHash: "" }));
                    }
                  }}
                  className={validationErrors.patentHash ? "border-red-500" : ""}
                />
                {validationErrors.patentHash ? (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.patentHash}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    The SHA256 hash of your patent document for verification
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="royaltiesSessionLink">Royalties Session Link *</Label>
                <Input
                  id="royaltiesSessionLink"
                  placeholder="Link to royalties session details"
                  value={royaltiesSessionLink}
                  onChange={(e) => {
                    setRoyaltiesSessionLink(e.target.value);
                    if (validationErrors.royaltiesSessionLink) {
                      setValidationErrors((prev) => ({ ...prev, royaltiesSessionLink: "" }));
                    }
                  }}
                  className={validationErrors.royaltiesSessionLink ? "border-red-500" : ""}
                />
                {validationErrors.royaltiesSessionLink && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.royaltiesSessionLink}</p>
                )}
              </div>

              <div>
                <Label htmlFor="royaltiesSessionHash">Royalties Session Hash *</Label>
                <Input
                  id="royaltiesSessionHash"
                  placeholder="Hash of royalties session"
                  value={royaltiesSessionHash}
                  onChange={(e) => {
                    setRoyaltiesSessionHash(e.target.value);
                    if (validationErrors.royaltiesSessionHash) {
                      setValidationErrors((prev) => ({ ...prev, royaltiesSessionHash: "" }));
                    }
                  }}
                  className={validationErrors.royaltiesSessionHash ? "border-red-500" : ""}
                />
                {validationErrors.royaltiesSessionHash && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.royaltiesSessionHash}</p>
                )}
              </div>
            </div>

            <TransactionStatus
              status={txStatus}
              txHash={txHash}
              error={error}
            />

            <Button type="submit" disabled={isLoading || txStatus === "success"} className="w-full">
              {isLoading ? "Creating Patent..." : txStatus === "success" ? "Patent Created!" : "Create Patent on Blockchain"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              This will create a new patent contract on Base Sepolia. Make sure you have some ETH for gas fees.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
