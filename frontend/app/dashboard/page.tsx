"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function DashboardHome() {
  const { user } = usePrivy();

  const stats = {
    totalInvestments: 3,
    totalPatents: 2,
    totalDonated: 1.5,
    portfolioValue: 5.2,
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email?.address || "Researcher"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvestments}</div>
            <p className="text-xs text-muted-foreground">
              Patents you're invested in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Patents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatents}</div>
            <p className="text-xs text-muted-foreground">
              Patents submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonated} ETH</div>
            <p className="text-xs text-muted-foreground">
              Supporting research
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.portfolioValue} ETH</div>
            <p className="text-xs text-muted-foreground">
              Total investment value
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Invested in Quantum Encryption</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <span className="text-sm font-semibold">0.5 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Donated to Bio-Reactive Nanocoating</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
                <span className="text-sm font-semibold">0.2 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Submitted New Patent</p>
                  <p className="text-xs text-muted-foreground">2 weeks ago</p>
                </div>
                <span className="text-xs text-muted-foreground">New</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/patents">Explore Patents</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/patents">Manage Your Patents</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/investments">View Investments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trending Patents</CardTitle>
          <CardDescription>Most funded patents this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex-1">
                <p className="font-medium">Quantum-Resilient Encryption Layer</p>
                <p className="text-sm text-muted-foreground">Dr. Sofia Martínez</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">12.5 ETH</p>
                <p className="text-xs text-muted-foreground">45 backers</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex-1">
                <p className="font-medium">AI-Driven Ocean Plastic Collector</p>
                <p className="text-sm text-muted-foreground">Ing. Carla Ruiz</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">8.3 ETH</p>
                <p className="text-xs text-muted-foreground">32 backers</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Bio-Reactive Nanocoating for Implants</p>
                <p className="text-sm text-muted-foreground">Dr. Alex Kim</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">6.7 ETH</p>
                <p className="text-xs text-muted-foreground">28 backers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
