"use client";

import Link from "next/link";
import LoginWithEmail from "@/components/privy/LoginWithEmail";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";


export default function HomePage() {
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background text-foreground">
      {/* Hero Section */}
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold md:text-5xl">
          Eureka — Funding Innovation Through Collective Intelligence
        </h1>

        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
          Discover scientific patents, support breakthrough research,
          and help bring ideas to life through donations or micro-investments.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            as={Link}
            href="/patents"
            size="lg"
            variant="solid"
            color="primary"
          >
            Explore Patents
          </Button>

          <Button
            as={Link}
            href="/login"
            size="lg"
            variant="solid"
          >
            Login as Researcher
          </Button>

        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-20 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Decentralized Identity</CardTitle>
            <CardDescription>
              Researchers authenticate using Account Abstraction for secure onboarding.
            </CardDescription>
          </CardHeader>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle >Transparent Donations</CardTitle>
            <CardDescription >
              All transactions remain traceable, enabling anyone to support
              science with confidence.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle >Micro-Investments</CardTitle>
            <CardDescription >
              Power-users can invest in early-stage patents and track their
              involvement through a dedicated dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
