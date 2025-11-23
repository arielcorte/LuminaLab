import { filecoinCalibration } from "viem/chains";
import { createConfig, http } from "wagmi";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [{ groupName: "Recommended", wallets: [metaMaskWallet] }],
  { appName: "Your App", projectId: "your-project-id" },
);

export const config = createConfig({
  connectors,
  chains: [filecoinCalibration],
  transports: {
    [filecoinCalibration.id]: http(),
  },
});
