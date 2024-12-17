import { useEffect, useState } from "react";
import { getEnsProfilesFromNamesOrAddresses } from "@/lib/ens";
import { EnsProfileType } from "@/lib/ens/types";

export const useEnsProfiles = (collectors: string[]) => {
  const [ensProfiles, setEnsProfiles] = useState<{
    [key: string]: EnsProfileType;
  }>({});

  useEffect(() => {
    const fetchEnsProfile = async () => {
      if (!collectors.length) return;
      const profiles = await getEnsProfilesFromNamesOrAddresses(collectors);
      if (!profiles) return;
      setEnsProfiles((prevProfiles) => {
        // Only update state if profiles have changed to avoid unnecessary re-renders
        const newProfiles = { ...prevProfiles, ...profiles };
        if (JSON.stringify(newProfiles) !== JSON.stringify(prevProfiles)) {
          return newProfiles;
        }
        return prevProfiles;
      });
      sessionStorage.setItem("lastEnsProfileFetch", Date.now().toString());
    };

    const lastFetchTime = sessionStorage.getItem("lastEnsProfileFetch");
    if (!lastFetchTime || Date.now() - parseInt(lastFetchTime) > 1000) {
      fetchEnsProfile();
    } else {
      setTimeout(() => {
        fetchEnsProfile();
      }, 1000);
    }
  }, [collectors]);

  return { ensProfiles };
};
