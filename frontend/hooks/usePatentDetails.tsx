"use client";

import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { PatentABI } from "@/abi/PatentABI";
import { config } from "@/lib/wagmi";

export function usePatentDetails(patentAddress) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patentAddress) return;

    async function load() {
      try {
        const [owner, link, hash, royaltiesLink, royaltiesHash, donorsCount] =
          await Promise.all([
            readContract(config, {
              address: patentAddress,
              abi: PatentABI,
              functionName: "owner",
            }),
            readContract(config, {
              address: patentAddress,
              abi: PatentABI,
              functionName: "patentLink",
            }),
            readContract(config, {
              address: patentAddress,
              abi: PatentABI,
              functionName: "patentHash",
            }),
            readContract(config, {
              address: patentAddress,
              abi: PatentABI,
              functionName: "royaltiesSessionLink",
            }),
            readContract(config, {
              address: patentAddress,
              abi: PatentABI,
              functionName: "royaltiesSessionHash",
            }),
            readContract(config, {
              address: patentAddress,
              abi: PatentABI,
              functionName: "getDonorsCount",
            }),
          ]);

        setDetails({
          owner,
          link,
          hash,
          royaltiesLink,
          royaltiesHash,
          donorsCount: Number(donorsCount),
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [patentAddress]);

  return { details, loading };
}
