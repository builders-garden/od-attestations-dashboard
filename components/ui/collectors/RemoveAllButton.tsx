import { CircleX } from "lucide-react";
import { Button } from "../button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { cn } from "@/lib/utils";

interface RemoveAllButtonProps {
  collectors: string[];
  handleRemoveAll: () => void;
}

export const RemoveAllButton: React.FC<RemoveAllButtonProps> = ({
  collectors,
  handleRemoveAll,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <div>
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveAll();
              }}
              className={cn(
                "w-fit transition-all duration-200 ease-in-out px-1.5",
                collectors.length > 0 && "w-fit px-1.5",
                collectors.length === 0 && "text-transparent w-0 p-0",
              )}
            >
              <CircleX className="h-[22px] w-[22px]" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary-foreground">
          Remove all collectors
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
