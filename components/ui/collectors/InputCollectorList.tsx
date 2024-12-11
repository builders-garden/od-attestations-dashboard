import { cn } from "@/lib/utils";
import { Input } from "../input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../button";
import CollectorRow from "./CollectorRow";
import { isAddress } from "viem";
import { toast } from "sonner";
import { getEnsProfileFromNameOrAddress } from "@/lib/ens";
import { CsvInputButton } from "./CsvInputButton";
import PaginatorButtons from "../paginatorButtons";
import { usePagination } from "@/components/hooks/usePagination";
import { RemoveAllButton } from "./RemoveAllButton";
import { Loader2 } from "lucide-react";

export interface InputCollectorListProps {
  collectors: string[];
  setCollectors: Dispatch<SetStateAction<string[]>>;
}

export const InputCollectorList: React.FC<InputCollectorListProps> = ({
  collectors,
  setCollectors,
}) => {
  const [input, setInput] = useState("");
  const [inputIsValid, setInputIsValid] = useState(false);
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedItems: paginatedCollectors,
  } = usePagination(collectors, 6);

  const handleRemove = (collector: string) => {
    setCollectors((prev) => prev.filter((c) => c !== collector));
  };

  const handleRemoveAll = () => {
    setCollectors([]);
    setCurrentPage(1);
  };

  const [loading, setLoading] = useState(false);

  const handleAdd = async (collector: string) => {
    setLoading(true);
    if (collector.endsWith(".eth")) {
      const profile = await getEnsProfileFromNameOrAddress(collector);
      const resolvedAddress = profile?.address;
      if (resolvedAddress) {
        collector = resolvedAddress;
      } else {
        toast.error("The ENS address you added doesn't exist.", {
          position: "top-right",
        });
        return;
      }
    }
    setInput("");
    setCollectors((prev) =>
      prev.includes(collector) ? prev : [...prev, collector],
    );
    setLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputIsValid) {
      handleAdd(input);
    }
  };

  useEffect(() => {
    setInputIsValid(input.endsWith(".eth") || isAddress(input));
  }, [input]);

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex w-full gap-1.5 justify-between">
        <Input
          placeholder="ENS or Address to add..."
          className="w-full"
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => handleAdd(input)}
          disabled={!inputIsValid}
          className={cn(
            "w-fit transition-all duration-200 ease-in-out",
            input.length > 0 && "w-fit px-4",
            input.length === 0 && "text-transparent w-0 p-0",
          )}
        >
          {loading && <Loader2 className="w-4 animate-spin" />}
          Add
        </Button>
        <CsvInputButton setCollectors={setCollectors} />
        <RemoveAllButton
          collectors={collectors}
          handleRemoveAll={handleRemoveAll}
        />
      </div>
      <div className="flex flex-col gap-3 w-full max-h-[50rem] overflow-y-auto">
        {paginatedCollectors.map((collector, index) => (
          <CollectorRow
            key={index}
            collector={collector}
            removable
            handleRemove={handleRemove}
          />
        ))}
      </div>
      <PaginatorButtons
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};
