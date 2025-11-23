"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { ready, user } = usePrivy();

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
  if (!user) return null; // While redirecting

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto gap-4">
      <h1 className="text-3xl font-bold mb-6">Researcher Profile</h1>

      <Card className="m-5 p-5">
        <CardTitle>Basic Info</CardTitle>
        <CardContent>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email?.address || "—"}</p>
        </CardContent>
      </Card>

      <Card className="m-5 p-5">
        <CardTitle>Wallet</CardTitle>
        {user.wallet ? (
          <CardContent>
            <p><strong>Address:</strong> {user.wallet.address}</p>
            <p><strong>Chain:</strong> {user.wallet.chainType}</p>
          </CardContent>
        ) : (
          <p className="text-gray-500 p-4">No wallet available.</p>
        )}
      </Card>

      <Card className="m-5 p-5">
        <CardTitle>My Patents</CardTitle>
        <CardContent className="space-y-4">

          {loadingPatents && <p>Loading your patents...</p>}

          {!loadingPatents && patents.length === 0 && (
            <p className="text-gray-500">You haven't created any patents yet.</p>
          )}

          {patents.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-md hover:bg-muted/50 transition"
            >
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>

              <div className="flex gap-2 mt-2 flex-wrap">
                {p.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm mt-2">
                <strong>Status:</strong> {p.isPublic ? "Public" : "Private"}
              </p>

              <a
                href={`/patents/${p.id}`}
                className="text-primary text-sm underline mt-2 inline-block"
              >
                View Patent →
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
