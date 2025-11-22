"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { ready, user, logout } = usePrivy();

  // Redirect if user not authenticated
  useEffect(() => {
    if (ready && !user) {
      router.push("/login");
    }
  }, [ready, user, router]);

  if (!ready) return <div className="p-6">Loading...</div>;
  if (!user) return null; // Mientras redirige

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Researcher Profile</h1>

      <div className="space-y-6 bg-white dark:bg-neutral-900 shadow rounded-2xl p-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
          <div className="text-gray-700 dark:text-gray-300">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email?.address || "—"}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Wallet</h2>
          {user.wallet
            ? (
              <div className="text-gray-700 dark:text-gray-300">
                <p><strong>Address:</strong> {user.wallet.address}</p>
                <p><strong>Chain:</strong> {user.wallet.chainType}</p>
              </div>
            )
            : <p className="text-gray-500">No wallet available.</p>}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Actions</h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Log out
          </button>
        </section>
      </div>
    </div>
  );
}
