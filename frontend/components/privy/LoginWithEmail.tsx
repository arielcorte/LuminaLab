import { useState } from "react";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

export default function LoginWithEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { ready } = usePrivy();

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="flex flex-col gap-6 p-6">

          <h2 className="text-xl font-semibold text-center mb-5 mt-5">
            Login with Email
          </h2>

          {/* Email input */}
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <Button onClick={() => sendCode({ email })}>Send Code</Button>

          {/* Code input */}
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
          />

          <Button onClick={() => loginWithCode({ code })}>
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
