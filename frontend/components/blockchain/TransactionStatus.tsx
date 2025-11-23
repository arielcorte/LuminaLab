"use client";

import { getExplorerTxUrl } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface TransactionStatusProps {
  status: "idle" | "pending" | "confirming" | "success" | "error";
  txHash?: string;
  error?: string;
  chainId?: number;
}

export function TransactionStatus({
  status,
  txHash,
  error,
  chainId = 84532,
}: TransactionStatusProps) {
  if (status === "idle") return null;

  return (
    <div className="mt-4 p-4 rounded-lg border">
      {status === "pending" && (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div>
            <p className="font-medium text-blue-600">Waiting for wallet confirmation...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please confirm the transaction in your wallet
            </p>
          </div>
        </div>
      )}

      {status === "confirming" && (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
          <div>
            <p className="font-medium text-yellow-600">Transaction submitted!</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Waiting for blockchain confirmation...
            </p>
            {txHash && (
              <a
                href={getExplorerTxUrl(txHash, chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                View on Explorer →
              </a>
            )}
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-3">
          <div className="rounded-full h-5 w-5 bg-green-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-600">Transaction successful!</p>
            {txHash && (
              <a
                href={getExplorerTxUrl(txHash, chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                View on Explorer →
              </a>
            )}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3">
          <div className="rounded-full h-5 w-5 bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-red-600">Transaction failed</p>
            {error && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
