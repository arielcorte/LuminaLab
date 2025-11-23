import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function PrivyLoginButton() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { login } = useLogin({
    onComplete: (user) => {
      console.log("User logged in:", user);
      router.replace("/dashboard");
    },
  });
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button disabled={disableLogin} onClick={login}>
      Log in
    </Button>
  );
}
