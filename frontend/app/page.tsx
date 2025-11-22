"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background text-foreground">
      {/* Hero */}
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold md:text-5xl">
          Eureka — Funding Innovation Through Collective Intelligence
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground">
          Discover scientific patents, support breakthrough research,
          and help bring ideas to life through donations or micro-investments.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/patents">Explore Patents</Link>
          </Button>

          <Button asChild size="lg" variant="secondary">
            <Link href="/login">Login as Researcher</Link>
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-20 w-full">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Decentralized Identity</CardTitle>
            <CardDescription>
              Researchers authenticate using Account Abstraction for secure onboarding.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Transparent Donations</CardTitle>
            <CardDescription>
              All transactions remain traceable, enabling anyone to support science confidently.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Micro-Investments</CardTitle>
            <CardDescription>
              Invest in early-stage patents and track your involvement through a dedicated dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
