"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import Link from "next/link";

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
    <Card shadow="md" className="flex flex-col" >
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          by {researcher}
        </p>
      </CardHeader>

      <CardBody>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Chip key={tag} variant="flat" color="primary" size="sm">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>

      <CardFooter className="mt-auto flex justify-between gap-3">
        <Button
          as={Link}
          href={`/patents/${id}`}
          variant="flat"
          color="primary"
        >
          View
        </Button>

        <Button
          as={Link}
          href={`/donate/${id}`}
          variant="solid"
          color="success"
        >
          Donate
        </Button>

        <Button
          as={Link}
          href={`/invest/${id}`}
          variant="bordered"
          color="secondary"
        >
          Invest
        </Button>
      </CardFooter>
    </Card>
  );
}
