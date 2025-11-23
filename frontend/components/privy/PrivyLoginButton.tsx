import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PrivyLoginButton() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { login } = useLogin({
    onComplete: (user) => {
      console.log("User logged in:", user);
      router.replace("/dashboard");
    },
  });

  // Don't render anything if already authenticated
  if (ready && authenticated) {
    return null;
  }

  return (
    <Button
      size="lg"
      disabled={!ready}
      onClick={login}
      className="transition-opacity duration-200"
    >
      {!ready ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        "Log in"
      )}
    </Button>
  );
}
