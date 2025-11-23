import { useLogin, usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/button';

export default function PrivyLoginButton() {
    const { ready, authenticated} = usePrivy();
    const { login } = useLogin();
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <Button disabled={disableLogin} onClick={login}>
            Log in
        </Button>
    );
}