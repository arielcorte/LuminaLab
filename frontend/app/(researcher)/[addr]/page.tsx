"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

type Patent = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  funded: number;
  backers: number;
  status: "active" | "funded" | "completed";
};

type Researcher = {
  address: string;
  name: string;
  bio: string;
  institution: string;
  totalPatents: number;
  totalFunding: number;
  followers: number;
  joinedDate: string;
};

const MOCK_RESEARCHERS: Record<string, Researcher> = {
  "0x0918ab0f0bebd01bc0280c9922b01": {
    address: "0x0918ab0f0bebd01bc0280c9922b01",
    name: "Dr. Sofia Martínez",
    bio: "Cryptographer and security researcher specializing in post-quantum cryptography and IoT security protocols. PhD from MIT, 15+ years of experience in cybersecurity.",
    institution: "MIT Cryptography Research Lab",
    totalPatents: 8,
    totalFunding: 45.3,
    followers: 234,
    joinedDate: "2024-03-15",
  },
  "0x1234567890abcdef1234567890abcd": {
    address: "0x1234567890abcdef1234567890abcd",
    name: "Dr. Alex Kim",
    bio: "Biomedical engineer focused on nanotech applications in medical implants and regenerative medicine.",
    institution: "Stanford Bioengineering Dept",
    totalPatents: 5,
    totalFunding: 28.7,
    followers: 156,
    joinedDate: "2024-06-20",
  },
  "0xabcdef1234567890abcdef123456": {
    address: "0xabcdef1234567890abcdef123456",
    name: "Ing. Carla Ruiz",
    bio: "Environmental engineer and AI researcher working on sustainable solutions for ocean cleanup and environmental restoration.",
    institution: "ETH Zurich",
    totalPatents: 6,
    totalFunding: 32.1,
    followers: 189,
    joinedDate: "2024-05-10",
  },
};

const MOCK_PATENTS: Record<string, Patent[]> = {
  "0x0918ab0f0bebd01bc0280c9922b01": [
    {
      id: "1",
      title: "Quantum-Resilient Encryption Layer",
      description: "A lightweight cryptographic layer designed for post-quantum resistance in IoT devices.",
      tags: ["Cryptography", "IoT", "Quantum"],
      funded: 12.5,
      backers: 45,
      status: "active",
    },
    {
      id: "4",
      title: "Zero-Knowledge Authentication Protocol",
      description: "Privacy-preserving authentication system for distributed networks.",
      tags: ["Cryptography", "Privacy"],
      funded: 8.2,
      backers: 32,
      status: "funded",
    },
  ],
  "0x1234567890abcdef1234567890abcd": [
    {
      id: "2",
      title: "Bio-Reactive Nanocoating for Implants",
      description: "A self-healing nanocoating that reduces inflammation around metallic implants.",
      tags: ["Biotech", "Nanotech"],
      funded: 6.7,
      backers: 28,
      status: "active",
    },
  ],
  "0xabcdef1234567890abcdef123456": [
    {
      id: "3",
      title: "AI-Driven Ocean Plastic Collector",
      description: "Autonomous surface robots that identify, cluster, and collect microplastics.",
      tags: ["AI", "Robotics", "Environment"],
      funded: 8.3,
      backers: 32,
      status: "active",
    },
  ],
};

export default function ResearcherPage() {
  const params = useParams();
  const addr = params?.addr as string;
  const [researcher, setResearcher] = useState<Researcher | null>(null);
  const [patents, setPatents] = useState<Patent[]>([]);

  useEffect(() => {
    if (addr) {
      const foundResearcher = MOCK_RESEARCHERS[addr];
      setResearcher(foundResearcher || null);
      setPatents(MOCK_PATENTS[addr] || []);
    }
  }, [addr]);

  if (!researcher) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Researcher Not Found</CardTitle>
            <CardDescription>
              The researcher profile you're looking for doesn't exist or hasn't been created yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/patents">Explore Patents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = researcher.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl">{researcher.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {researcher.institution}
                  </CardDescription>
                </div>
                <Button>Follow</Button>
              </div>
              <p className="text-muted-foreground">{researcher.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold">{researcher.totalPatents}</span>{" "}
                  <span className="text-muted-foreground">Patents</span>
                </div>
                <div>
                  <span className="font-semibold">{researcher.followers}</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{researcher.totalFunding} ETH</span>{" "}
                  <span className="text-muted-foreground">Total Funded</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patents.filter((p) => p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently seeking funding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researcher.totalFunding} ETH</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(researcher.joinedDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Verified researcher
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patents by {researcher.name}</CardTitle>
          <CardDescription>
            {patents.length} patent{patents.length !== 1 ? "s" : ""} submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patents.map((patent) => (
              <div
                key={patent.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/patents/${patent.id}`}
                        className="font-semibold text-lg hover:underline"
                      >
                        {patent.title}
                      </Link>
                      <Badge
                        variant={
                          patent.status === "active"
                            ? "default"
                            : patent.status === "funded"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {patent.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {patent.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {patent.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-semibold">{patent.funded} ETH</span>{" "}
                      <span className="text-muted-foreground">raised</span>
                    </div>
                    <div>
                      <span className="font-semibold">{patent.backers}</span>{" "}
                      <span className="text-muted-foreground">backers</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/patents/${patent.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {patents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No patents submitted yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {researcher.address}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
