import { getEnsProfileFromNameOrAddress } from "@/lib/ens";
import { EnsProfileType } from "@/lib/ens/types";
import { useState, useEffect } from "react";

export function useEnsProfile(collector?: string) {
  const [ensProfile, setEnsProfile] = useState<EnsProfileType>();

  useEffect(() => {
    const fetchEnsProfile = async () => {
      if (!collector) return;
      const profile = await getEnsProfileFromNameOrAddress(collector);
      if (!profile) return;
      setEnsProfile(profile);
    };
    fetchEnsProfile();
  }, [collector]);

  return { ensProfile };
}
