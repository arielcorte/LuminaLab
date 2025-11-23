import { useWallets } from "@privy-io/react-auth";
import { BrowserProvider, JsonRpcSigner } from "ethers";

// Filecoin Calibration testnet
const FILECOIN_CALIBRATION_CHAIN_ID = 314159;

export const useEthersSigner = () => {
  const { wallets } = useWallets();

  const wallet = wallets[0];

  if (!wallet) return null;

  const getSigner = async (): Promise<JsonRpcSigner | null> => {
    try {
      // Switch to Filecoin Calibration testnet
      await wallet.switchChain(FILECOIN_CALIBRATION_CHAIN_ID);

      // Get the EIP-1193 provider
      const provider = await wallet.getEthereumProvider();

      // Wrap with ethers
      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      console.log("Connected to chain:", await signer.provider.getNetwork());

      return signer;
    } catch (error) {
      console.error("Error getting signer:", error);
      return null;
    }
  };

  return getSigner;
};
