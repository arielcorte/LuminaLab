"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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
  return (
    <Card className="flex flex-col p-7" >
      <CardTitle className="flex flex-col items-start gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          by {researcher}
        </p>
      </CardTitle>

      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {description}
        </p>

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

      <CardFooter className="mt-auto flex justify-between gap-3">
        <Button
          asChild
          variant={"link"}
        >
          <Link
          href={`/patents/${id}`}
          >
          View
          </Link>
        </Button>

        <Button
          asChild
        >
          <Link
          href={`/donate/${id}`}>
          Donate
          </Link>
        </Button>

        <Button
          asChild
        >
        <Link
          href={`/invest/${id}`}
        >
          Invest
        </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
