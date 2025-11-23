"use client";

import { useState } from "react";
import { truncateAddress, getExplorerAddressUrl, copyToClipboard } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddressDisplayProps {
  address: string;
  label?: string;
  chainId?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  truncate?: boolean;
}

export function AddressDisplay({
  address,
  label,
  chainId = 84532,
  showCopy = true,
  showExplorer = true,
  truncate = true,
}: AddressDisplayProps) {
  const displayAddress = truncate ? truncateAddress(address) : address;
  const explorerUrl = getExplorerAddressUrl(address, chainId);

  const handleCopy = async () => {
    const success = await copyToClipboard(address);
    if (success) {
      toast.success("Address copied to clipboard!");
    } else {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>}

      <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
        {displayAddress}
      </code>

      {showCopy && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </Button>
      )}

      {showExplorer && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
          </Button>
        </a>
      )}
    </div>
  );
}
