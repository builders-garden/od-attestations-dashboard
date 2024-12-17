import { FileUp, Loader2Icon } from "lucide-react";
import { Button } from "../button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  getEnsProfileFromNameOrAddress,
  getEnsProfilesFromNamesOrAddresses,
} from "@/lib/ens";
import { isAddress } from "viem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "../tooltip";

export interface CsvInputButtonProps {
  setCollectors: (collectors: React.SetStateAction<string[]>) => void;
}

export const CsvInputButton: React.FC<CsvInputButtonProps> = ({
  setCollectors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setLoadingFile(true);
        const content = e.target?.result as string;
        const lines = content.split("\n");
        const firstColumnData = lines
          .slice(1)
          .map((line) => line.split(",")[0].trim())
          .filter(Boolean);

        // Initialize the resolved addresses array
        const resolvedAddresses: string[] = [];

        const profiles =
          await getEnsProfilesFromNamesOrAddresses(firstColumnData);

        // If there are no profiles, return
        if (!profiles) {
          return setLoadingFile(false);
        }

        // Add the resolved addresses to the resolvedAddresses array
        resolvedAddresses.push(
          ...Object.values(profiles).map((profile) => profile.address),
        );

        const validAddresses = resolvedAddresses.filter((address) =>
          isAddress(address),
        );

        setCollectors((prevCollectors) => [
          ...prevCollectors,
          ...validAddresses.filter(
            (address) => !prevCollectors.includes(address),
          ),
        ]);
        setLoadingFile(false);
      };
      reader.readAsText(file);
    } else {
      toast.error("Please select a valid CSV file.", {
        position: "top-right",
      });
    }

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <div>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                disabled={loadingFile}
                className="w-[36px] h-[36px]"
              >
                {!loadingFile ? (
                  <FileUp className="h-[22px] w-[22px]" />
                ) : (
                  <Loader2Icon className="h-[22px] w-[22px] animate-spin" />
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary-foreground">
            Upload CSV file
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />
    </>
  );
};
