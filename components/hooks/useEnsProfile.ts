import { EnsProfileType, getEnsProfiles } from "@/lib/ens";
import { useState, useEffect } from "react";

export function useEnsProfiles(addresses: `0x${string}`[]) {
  const [ensProfiles, setEnsProfiles] = useState<EnsProfileType[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const fetchEnsProfiles = async () => {
      if (addresses.length === 0) {
        setLoadingProfiles(false);
        return;
      }
      const profiles = await getEnsProfiles(addresses);
      setEnsProfiles(profiles);
      setLoadingProfiles(false);
    };
    fetchEnsProfiles();
  }, [addresses.length]);

  return { ensProfiles, loadingProfiles };
}
