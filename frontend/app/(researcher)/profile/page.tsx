"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { ready, user, logout } = usePrivy();

  const [patents, setPatents] = useState<any[]>([]);
  const [loadingPatents, setLoadingPatents] = useState(true);

  // Redirect if user not authenticated
  useEffect(() => {
    if (ready && !user) {
      router.push("/");
    }
  }, [ready, user, router]);

  // Fetch patents for this user
  useEffect(() => {
    if (!user?.wallet?.address) return;

    const fetchPatents = async () => {
      try {
        const wallet = user.wallet.address;
        const res = await fetch(`/api/patents?owner=${wallet}`);
        const data = await res.json();
        setPatents(data || []);
      } catch (err) {
        console.error("Error fetching patents:", err);
      } finally {
        setLoadingPatents(false);
      }
    };

    fetchPatents();
  }, [user]);

  if (!ready) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  const initials = user.email?.address
    ? user.email.address.slice(0, 2).toUpperCase()
    : "U";

  const stats = {
    totalPatents: patents.length,
    publicPatents: patents.filter((p) => p.isPublic).length,
    privatePatents: patents.filter((p) => !p.isPublic).length,
    totalFunding: 0,
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and patents
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {user.email?.address || "Researcher"}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    User ID: {user.id.slice(0, 16)}...
                  </CardDescription>
                </div>
                <Button variant="destructive" onClick={logout}>
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patents</CardTitle>
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
            <CardTitle className="text-sm font-medium">Public Patents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicPatents}</div>
            <p className="text-xs text-muted-foreground">
              Visible to community
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Patents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.privatePatents}</div>
            <p className="text-xs text-muted-foreground">
              Draft or unlisted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFunding} ETH</div>
            <p className="text-xs text-muted-foreground">
              From all patents
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {user.email?.address || "No email connected"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">User ID</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {user.id}
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Your connected wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.wallet ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Address</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                    {user.wallet.address}
                  </code>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Chain Type</p>
                  <p className="text-sm text-muted-foreground">
                    {user.wallet.chainType}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No wallet connected</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Patents</CardTitle>
          <CardDescription>
            {loadingPatents
              ? "Loading your patents..."
              : `${patents.length} patent${patents.length !== 1 ? "s" : ""} submitted`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingPatents && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Loading your patents...</p>
              </div>
            )}

            {!loadingPatents && patents.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  You haven't created any patents yet
                </p>
                <Button asChild>
                  <Link href="/patents">Create Your First Patent</Link>
                </Button>
              </div>
            )}

            {patents.map((p) => (
              <div
                key={p.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/patents/${p.id}`}
                        className="font-semibold text-lg hover:underline"
                      >
                        {p.title}
                      </Link>
                      <Badge variant={p.isPublic ? "default" : "secondary"}>
                        {p.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {p.description}
                    </p>
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/patents/${p.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
