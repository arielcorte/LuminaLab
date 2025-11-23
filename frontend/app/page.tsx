"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrivyLoginButton from "@/components/privy/PrivyLoginButton";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center py-16 px-4 min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="space-y-6 max-w-2xl text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Eureka — Funding Innovation Through Collective Intelligence
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground">
          Discover scientific patents, support breakthrough research, and help
          bring ideas to life through donations or micro-investments.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/patents">I'm a scientist</Link>
          </Button>

          <PrivyLoginButton />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-6 mt-20 w-full max-w-5xl md:grid-cols-3">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Decentralized Identity</CardTitle>
            <CardDescription>
              Researchers authenticate using Account Abstraction for secure
              onboarding.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Transparent Donations</CardTitle>
            <CardDescription>
              All transactions remain traceable, enabling anyone to support
              science confidently.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Micro-Investments</CardTitle>
            <CardDescription>
              Invest in early-stage patents and track your involvement through a
              dedicated dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
