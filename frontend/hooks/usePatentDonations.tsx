"use client";

import { useEffect, useState } from "react";
import { getLogs } from "wagmi/actions";
import { PatentABI } from "@/abi/PatentABI";
import { config } from "@/lib/wagmi";

export function usePatentDonations(patentAddress) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patentAddress) return;

    async function load() {
      try {
        const logs = await getLogs(config, {
          address: patentAddress,
          abi: PatentABI,
          eventName: "Donation",
        });

        const formatted = logs.map((l) => ({
          donor: l.args.donor,
          amount: Number(l.args.amount),
          tx: l.transactionHash,
        }));

        setDonations(formatted);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [patentAddress]);

  return { donations, loading };
}
