"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFViewer } from "@/components/patents/PDFViewer";

type Patent = {
  id: string;
  title: string;
  researcher: string;
  description: string;
  address: string;
  tags: string[];
};

const MOCK_PATENTS: Patent[] = [
  {
    id: "1",
    title: "Quantum-Resilient Encryption Layer",
    researcher: "Dr. Sofia Martínez",
    description:
      "A lightweight cryptographic layer designed for post-quantum resistance in IoT devices.",
    address: "0x0918ab0f0bebd01bc0280c9922b01",
    tags: ["Cryptography", "IoT", "Quantum"],
  },
  {
    id: "2",
    title: "Bio-Reactive Nanocoating for Implants",
    researcher: "Dr. Alex Kim",
    description:
      "A self-healing nanocoating that reduces inflammation around metallic implants.",
    address: "0x0918ab0f0bebd01bc0280c9922b01",
      
    tags: ["Biotech", "Nanotech"],
  },
  {
    id: "3",
    title: "AI-Driven Ocean Plastic Collector",
    researcher: "Ing. Carla Ruiz",
    description:
      "Autonomous surface robots that identify, cluster, and collect microplastics.",
    address: "0x0918ab0f0bebd01bc0280c9922b01",
    tags: ["AI", "Robotics", "Environment"],
  },
];

export default function PatentPage() {
  const params = useParams();
  const { id } = params;
  const [patent, setPatent] = useState<Patent | null>(null);

  useEffect(() => {
    const found = MOCK_PATENTS.find((p) => p.id === id);
    setPatent(found || null);
  }, [id]);

  if (!patent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Patent not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      <Card className="w-full max-w-3xl p-10">
        <CardHeader>
          <CardTitle className="text-3xl">{patent.title}</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            By {patent.researcher}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-200">{patent.description}</p>

          <div className="flex flex-wrap gap-2">
            {patent.tags.map((tag) => (
                <Badge
                key={tag}
                >
                {tag}
              </Badge>
            ))}
          </div>

          <PDFViewer pdfUrl="http://sampleURL.com/pdf_placeholder" />

          <div className="mt-6 flex gap-4">
          <p className="text-gray-700 dark:text-gray-200 ">Address: {patent.address}</p>
            <Button>
              Donate
            </Button>
            <Button>
              Invest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
