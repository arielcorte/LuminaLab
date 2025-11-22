"use client";

import { useState, useEffect } from "react";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

export default function LoginWithEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  // ⬇️ Redirige automáticamente cuando el login fue exitoso
  useEffect(() => {
    if (ready && authenticated && user) {
      router.push("/profile");
    }
  }, [ready, authenticated, user, router]);

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-center">Login with Email</h2>

          <Input
            className="w-full px-3 py-2 border rounded"
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.currentTarget.value)}
            value={email}
          />

          <Button className="w-full" onClick={() => sendCode({ email })}>
            Send Code
          </Button>

          <Input
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter code"
            onChange={(e) => setCode(e.currentTarget.value)}
            value={code}
          />

          <Button className="w-full" onClick={() => loginWithCode({ code })}>
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
