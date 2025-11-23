"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

type Investment = {
  id: string;
  patentId: string;
  patentTitle: string;
  researcher: string;
  amount: number;
  date: string;
  currentValue: number;
  status: "active" | "pending" | "completed";
  returns: number;
};

const MOCK_INVESTMENTS: Investment[] = [
  {
    id: "inv-1",
    patentId: "1",
    patentTitle: "Quantum-Resilient Encryption Layer",
    researcher: "Dr. Sofia Martínez",
    amount: 2.5,
    date: "2025-10-15",
    currentValue: 3.2,
    status: "active",
    returns: 28,
  },
  {
    id: "inv-2",
    patentId: "3",
    patentTitle: "AI-Driven Ocean Plastic Collector",
    researcher: "Ing. Carla Ruiz",
    amount: 1.5,
    date: "2025-11-01",
    currentValue: 1.8,
    status: "active",
    returns: 20,
  },
  {
    id: "inv-3",
    patentId: "2",
    patentTitle: "Bio-Reactive Nanocoating for Implants",
    researcher: "Dr. Alex Kim",
    amount: 1.2,
    date: "2025-11-10",
    currentValue: 1.25,
    status: "pending",
    returns: 4,
  },
];

const MOCK_DONATIONS = [
  {
    id: "don-1",
    patentTitle: "Quantum-Resilient Encryption Layer",
    amount: 0.5,
    date: "2025-11-20",
  },
  {
    id: "don-2",
    patentTitle: "Bio-Reactive Nanocoating for Implants",
    amount: 0.8,
    date: "2025-11-15",
  },
  {
    id: "don-3",
    patentTitle: "AI-Driven Ocean Plastic Collector",
    amount: 0.2,
    date: "2025-11-05",
  },
];

export default function InvestmentsPage() {
  const [investments] = useState<Investment[]>(MOCK_INVESTMENTS);
  const [donations] = useState(MOCK_DONATIONS);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = currentValue - totalInvested;
  const returnPercentage = ((totalReturns / totalInvested) * 100).toFixed(1);
  const totalDonated = donations.reduce((sum, don) => sum + don.amount, 0);

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Investments</h1>
        <p className="text-muted-foreground">
          Track your portfolio and support for innovative patents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvested.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">
              Across {investments.length} patents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentValue.toFixed(2)} ETH</div>
            <p className="text-xs text-green-600">
              +{returnPercentage}% return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{totalReturns.toFixed(2)} ETH
            </div>
            <p className="text-xs text-muted-foreground">Unrealized gains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonated.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">
              {donations.length} donations made
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="investments" className="w-full">
        <TabsList>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>
                Your active and pending patent investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/patents/${investment.patentId}`}
                          className="font-medium hover:underline"
                        >
                          {investment.patentTitle}
                        </Link>
                        <Badge
                          variant={
                            investment.status === "active"
                              ? "default"
                              : investment.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {investment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By {investment.researcher}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Invested on {new Date(investment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">
                        {investment.currentValue.toFixed(2)} ETH
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Initial: {investment.amount.toFixed(2)} ETH
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          investment.returns >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {investment.returns >= 0 ? "+" : ""}
                        {investment.returns}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {investments.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    You haven't made any investments yet
                  </p>
                  <Button asChild>
                    <Link href="/patents">Explore Patents</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                Your contributions to research projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{donation.patentTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        Donated on {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{donation.amount.toFixed(2)} ETH</div>
                    </div>
                  </div>
                ))}
              </div>

              {donations.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    You haven't made any donations yet
                  </p>
                  <Button asChild>
                    <Link href="/patents">Support Research</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
