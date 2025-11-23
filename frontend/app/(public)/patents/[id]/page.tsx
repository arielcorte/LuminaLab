"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFViewer } from "@/components/patents/PDFViewer";
import { usePrivy } from "@privy-io/react-auth";
import { usePatentDetails } from "@/hooks/usePatentDetails";
import { useDonateToPatent } from "@/hooks/useDonateToPatent";
import { Input } from "@/components/ui/input";
import { AddressDisplay } from "@/components/blockchain/AddressDisplay";
import { TransactionStatus } from "@/components/blockchain/TransactionStatus";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/errors";
import { formatEth, truncateHash } from "@/lib/format";

export default function PatentPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const { authenticated } = usePrivy();
  const [donationAmount, setDonationAmount] = useState("0.01");
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "confirming" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>();

  const router = useRouter();
  const [count, setCount] = useState(5);

  // Fetch patent details from blockchain
  const { details, loading } = usePatentDetails(id);
  const { donate, isLoading: isDonating, error: donateError } = useDonateToPatent();

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
        <p className="text-gray-500 dark:text-gray-400">Loading patent details...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Patent not found</p>
      </div>
    );
  }

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid donation amount greater than 0",
      });
      return;
    }

    setTxStatus("pending");
    toast.info("Please confirm the donation in your wallet");

    try {
      const result = await donate(id, donationAmount);

      if (result.success) {
        setTxHash(result.transactionHash);
        setTxStatus("success");
        toast.success("Donation successful!", {
          description: `You donated ${formatEth(donationAmount)} ETH to this patent`,
        });

        // Reset form after success
        setTimeout(() => {
          setTxStatus("idle");
          setDonationAmount("0.01");
        }, 3000);
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
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      <Card className="w-full max-w-3xl p-10">
        <CardHeader>
          <CardTitle className="text-3xl">Patent Details</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
            <AddressDisplay address={details.owner} label="Owner" />
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Contract Address</h3>
            <AddressDisplay address={id} truncate={false} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Patent Document</h3>
            <a
              href={details.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all inline-flex items-center gap-2"
            >
              {details.link}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" x2="21" y1="14" y2="3" />
              </svg>
            </a>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Document Hash</h3>
            <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all block">
              {details.hash}
            </code>
            <p className="text-xs text-gray-500">
              Use this hash to verify document integrity
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Royalties Session</h3>
            <a
              href={details.royaltiesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all inline-flex items-center gap-2"
            >
              {details.royaltiesLink}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" x2="21" y1="14" y2="3" />
              </svg>
            </a>
          </div>

          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="font-semibold text-lg">Statistics</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Donors:</span>
                <span className="font-semibold text-lg">{details.donorsCount}</span>
              </div>
            </div>
          </div>

          {details.link && (
            <PDFViewer pdfUrl={details.link} />
          )}

          <div className="mt-6 space-y-4 border-t pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 dark:text-blue-400"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Support This Patent</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Funds go directly to the patent owner's wallet
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex gap-2 items-end flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Amount (ETH)
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="0.01"
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleDonate}
                  disabled={isDonating || txStatus === "pending" || txStatus === "confirming"}
                  className="min-w-[140px] h-10"
                  size="lg"
                >
                  {isDonating || txStatus === "pending" || txStatus === "confirming"
                    ? "Processing..."
                    : "Donate Now"}
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {["0.001", "0.01", "0.1", "1"].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setDonationAmount(amount)}
                    disabled={txStatus === "pending" || txStatus === "confirming"}
                  >
                    {amount} ETH
                  </Button>
                ))}
              </div>
            </div>

            <TransactionStatus
              status={txStatus}
              txHash={txHash}
              error={donateError || undefined}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
