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
    <Card className="flex flex-col p-6 group hover:shadow-lg transition-all duration-300 border-border/50 card-glow bg-card">
      {/* Header Section */}
      <CardTitle className="flex flex-col items-start gap-3 mb-4">
        <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Researcher Address */}
        <div className="flex items-center gap-2 text-sm w-full">
          <span className="text-muted-foreground text-xs">by</span>
          <code className="px-2 py-1 text-xs font-mono bg-muted/50 border border-border rounded ring-1 ring-primary/10">
            {truncateAddress(researcher)}
          </code>
          <button
            onClick={handleCopyAddress}
            className="p-1 hover:bg-accent rounded transition-all ml-auto"
            title="Copy address"
          >
            {copied ? (
              <Check className="w-3 h-3 text-primary" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        </div>
      </CardTitle>

      {/* Content Section */}
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-primary/5 border-primary/20 text-primary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Actions Section */}
      <CardFooter className="mt-4 pt-4 border-t border-border/50">
        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
          <Link href={`/patents/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
