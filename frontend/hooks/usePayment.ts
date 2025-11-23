import { useMutation } from "@tanstack/react-query";
import { Synapse, TOKENS, TIME_CONSTANTS } from "@filoz/synapse-sdk";
import { useEthersSigner } from "./useEthersSigner";

const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
);

export const usePayment = () => {
  const getSigner = useEthersSigner();

  const mutation = useMutation({
    mutationFn: async ({ depositAmount }: { depositAmount: bigint }) => {
      if (!getSigner) throw new Error("Wallet not connected");

      const signer = await getSigner();
      if (!signer) throw new Error("Failed to get signer");

      const synapse = await Synapse.create({ signer });
      const warmStorageAddress = synapse.getWarmStorageAddress();

      // Check if user has sufficient USDFC tokens
      const balance = await synapse.payments.walletBalance(TOKENS.USDFC);

      if (balance < depositAmount) {
        throw new Error("Insufficient USDFC balance in wallet");
      }

      // Deposit and approve operator in one transaction
      if (depositAmount > 0n) {
        const tx = await synapse.payments.depositWithPermitAndApproveOperator(
          depositAmount,
          warmStorageAddress,
          MAX_UINT256, // rate allowance
          MAX_UINT256, // lockup allowance
          TIME_CONSTANTS.EPOCHS_PER_MONTH,
        );
        await tx.wait(1);
      } else {
        // Just approve if no deposit needed
        const tx = await synapse.payments.approveService(
          warmStorageAddress,
          MAX_UINT256,
          MAX_UINT256,
          TIME_CONSTANTS.EPOCHS_PER_MONTH,
        );
        await tx.wait(1);
      }

      return depositAmount;
    },
  });

  return { mutation };
};
