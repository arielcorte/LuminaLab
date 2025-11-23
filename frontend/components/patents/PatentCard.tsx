"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { truncateAddress, copyToClipboard } from "@/lib/format";
import { toast } from "sonner";

export interface PatentCardProps {
  id: string;
  title: string;
  researcher: string;
  description: string;
  tags?: string[];
}

export function PatentCard({
  id,
  title,
  researcher,
  description,
  tags = [],
}: PatentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.preventDefault();
    const success = await copyToClipboard(researcher);

    if (success) {
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy address");
    }
  };

  return (
    <Card className="flex flex-col p-7">
      {/* Header Section */}
      <CardTitle className="flex flex-col items-start gap-2">
        <h3 className="text-xl font-semibold">{title}</h3>

        {/* Researcher Address */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">by</span>
          <code className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded">
            {truncateAddress(researcher)}
          </code>
          <button
            onClick={handleCopyAddress}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3 text-gray-500" />
            )}
          </button>
        </div>
      </CardTitle>

      {/* Content Section */}
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" color="primary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Actions Section */}
      <CardFooter className="mt-auto pt-4">
        <Button asChild className="w-full">
          <Link href={`/patents/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
