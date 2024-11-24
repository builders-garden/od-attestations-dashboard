import { cn, shorten } from "@/lib/utils";
import { Check, CircleX } from "lucide-react";

interface CollectorRowProps {
  collector: string;
  selectable?: boolean;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  handleRemove?: (collector: string) => void;
}

export default function CollectorRow({
  collector,
  selectable,
  selected,
  removable,
  onClick,
  handleRemove,
}: CollectorRowProps) {
  const isAddress = collector.startsWith("0x");
  const name = isAddress ? shorten(collector) : collector;

  return (
    <div
      className={cn(
        "flex flex-row justify-between items-center w-full p-2 gap-2 bg-secondary rounded-lg transition-all duration-200 ease-in-out",
        selectable && "cursor-pointer hover:bg-green-200",
        selected && "bg-green-300 hover:bg-green-300",
      )}
      onClick={onClick}
    >
      <div className="flex justify-start items-center gap-2">
        <div className="p-4 bg-primary-light rounded-lg" />
        <label
          className={cn(
            "font-medium",
            selectable && "cursor-pointer",
            isAddress && "font-mono",
          )}
        >
          {name}
        </label>
      </div>
      {!(selectable || selected || removable) && (
        <div className="flex justify-center items-center font-medium px-2.5 bg-primary rounded-lg text-white">
          12
        </div>
      )}
      {selected && (
        <Check
          size="2rem"
          className="bg-green-600 p-1 rounded-md text-white transition-all duration-200 ease-in-out"
        />
      )}
      {removable && handleRemove && (
        <CircleX
          size="2rem"
          className="bg-destructive p-1 rounded-md text-white transition-all duration-200 ease-in-out cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(collector);
          }}
        />
      )}
    </div>
  );
}
