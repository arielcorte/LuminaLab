"use client";

import { UserPill } from "@privy-io/react-auth/ui";

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-end p-3">
        <UserPill />
      </div>

      <h1>Your investments</h1>
    </div>
  );
}
