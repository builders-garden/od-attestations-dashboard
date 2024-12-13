import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginatorButtonsProps {
  currentPage: number;
  setCurrentPage: (value: React.SetStateAction<number>) => void;
  totalPages: number;
}

export default function PaginatorButtons({
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginatorButtonsProps) {
  return (
    totalPages > 1 && (
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage((prev) => Math.max(prev - 1, 1));
          }}
          disabled={currentPage === 1}
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
          }}
          disabled={currentPage === totalPages}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  );
}
