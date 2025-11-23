import {
  Synapse,
  TIME_CONSTANTS,
  SIZE_CONSTANTS,
  TOKENS,
  WarmStorageService,
} from "@filoz/synapse-sdk";

const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
);

export const calculateStorageMetrics = async (
  synapse: Synapse,
  config: {
    storageCapacity: number;
    persistencePeriod: number;
    minDaysThreshold?: number;
  },
  fileSize?: number,
) => {
  const minDaysThreshold = config.minDaysThreshold || 50;

  const bytesToStore = fileSize
    ? fileSize
    : Number(BigInt(config.storageCapacity) * SIZE_CONSTANTS.GiB);

  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress(),
  );

  // Fetch approval info, account info, and storage costs in parallel
  const [allowance, accountInfo, prices] = await Promise.all([
    synapse.payments.serviceApproval(synapse.getWarmStorageAddress()),
    synapse.payments.accountInfo(TOKENS.USDFC),
    warmStorageService.calculateStorageCost(bytesToStore),
  ]);

  const availableFunds = accountInfo.availableFunds;
  const daysLeft = Number(availableFunds) / Number(prices.perDay);
  const amountNeeded = prices.perDay * BigInt(config.persistencePeriod);

  const totalDepositNeeded =
    daysLeft >= minDaysThreshold
      ? 0n
      : amountNeeded - accountInfo.availableFunds;

  const availableToFreeUp =
    accountInfo.availableFunds > amountNeeded
      ? accountInfo.availableFunds - amountNeeded
      : 0n;

  const isRateSufficient = allowance.rateAllowance >= MAX_UINT256 / 2n;
  const isLockupSufficient = allowance.lockupAllowance >= MAX_UINT256 / 2n;
  const isSufficient =
    isRateSufficient && isLockupSufficient && daysLeft >= minDaysThreshold;

  return {
    depositNeeded: totalDepositNeeded,
    availableToFreeUp,
    daysLeft,
    isRateSufficient,
    isLockupSufficient,
    isSufficient,
  };
};
