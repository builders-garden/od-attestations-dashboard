import { cn } from "@/lib/utils";
import { Input } from "../input";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../button";
import CollectorRow from "./CollectorRow";

export interface InputCollectorListProps {
  collectors: string[];
  setCollectors: Dispatch<SetStateAction<string[]>>;
}

export const InputCollectorList: React.FC<InputCollectorListProps> = ({
  collectors,
  setCollectors,
}) => {
  const [input, setInput] = useState("");

  const handleRemove = (collector: string) => {
    setCollectors((prev) => prev.filter((c) => c !== collector));
  };

  const handleAdd = (collector: string) => {
    setCollectors((prev) =>
      prev.includes(collector) ? prev : [...prev, collector],
    );
    setInput("");
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <div
        className={cn(
          "flex w-full gap-0 justify-between",
          input.length > 0 && "gap-4",
        )}
      >
        <Input
          placeholder="ENS or Address..."
          className="w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => handleAdd(input)}
          className={cn(
            "w-fit transition-all duration-200 ease-in-out",
            input.length > 0 && "w-fit px-4",
            input.length === 0 && "text-transparent w-0 p-0",
          )}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-col gap-3 w-full max-h-[50rem] overflow-y-auto">
        {collectors.map((collector, index) => (
          <CollectorRow
            key={index}
            collector={collector}
            removable
            handleRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};
