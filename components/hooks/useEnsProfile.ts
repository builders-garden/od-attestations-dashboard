import { EnsProfileType, getEnsProfile } from "@/lib/ens";
import { useState, useEffect } from "react";

export function useEnsProfile(address: `0x${string}`) {
  const [ensProfile, setEnsProfile] = useState<EnsProfileType | undefined>();
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchEnsProfile = async () => {
      if (!address) return;
      const profile = await getEnsProfile(address);
      // if no ENS profile is found, simulate a small delay
      if (!profile.name) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setEnsProfile(profile);
      setLoadingProfile(false);
    };
    fetchEnsProfile();
  }, [address]);

  return { ensProfile, loadingProfile };
}
