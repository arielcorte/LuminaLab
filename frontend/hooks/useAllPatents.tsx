"use client";

import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { FactoryABI } from "../abi/FactoryABI";
import { config } from "@/lib/wagmi";

export function useAllPatents(factoryAddress) {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await readContract(config, {
          address: factoryAddress,
          abi: FactoryABI,
          functionName: "getAllPatents",
        });
        setPatents(result);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [factoryAddress]);

  return { patents, loading };
}
