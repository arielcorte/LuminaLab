import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { FactoryABI } from "../abi/FactoryABI.js"
import { PatentABI } from "../abi/PatentABI.js"

const FACTORY_ADDRESS = "0xTU_FACTORY"; // <-- poné tu address

export function useMyPatents() {
  const { user } = usePrivy();
  const owner = user?.wallet?.address;

  const [myPatents, setMyPatents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!owner) return;

    async function fetchPatents() {
      setLoading(true);

      // 1. Traer todas las patentes creadas
      const all = await readContract({
        address: FACTORY_ADDRESS,
        abi: FactoryABI,
        functionName: "getAllPatents",
      });

      const mine: string[] = [];

      // 2. Filtrar por owner
      for (let pat of all as string[]) {
        const patOwner = await readContract({
          address: pat,
          abi: PatentABI,
          functionName: "owner",
        });

        if (patOwner.toLowerCase() === owner.toLowerCase()) {
          mine.push(pat);
        }
      }

      setMyPatents(mine);
      setLoading(false);
    }

    fetchPatents();
  }, [owner]);

  return { myPatents, loading };
}
