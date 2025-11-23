"use client";

import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { FactoryABI } from "../abi/FactoryABI";
import { PatentABI } from "../abi/PatentABI";
import { config } from "@/lib/wagmi";

export function useMyPatents(factoryAddress, myAddress) {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!myAddress) return;

    async function load() {
      try {
        const all = await readContract(config, {
          address: factoryAddress,
          abi: FactoryABI,
          functionName: "getAllPatents",
        });

        const owned = [];

        for (const patentAddr of all) {
          const owner = await readContract(config, {
            address: patentAddr,
            abi: PatentABI,
            functionName: "owner",
          });

          if (owner.toLowerCase() === myAddress.toLowerCase()) {
            owned.push(patentAddr);
          }
        }

        setPatents(owned);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [factoryAddress, myAddress]);

  return { patents, loading };
}
