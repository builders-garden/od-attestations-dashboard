import { useEffect, useMemo, useState } from "react";

export const usePagination = (items: any[], itemsPerPage: number) => {
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems: any[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage]);

  useEffect(() => {
    if (paginatedItems.length === 0) {
      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    }
  }, [paginatedItems]);

  return { currentPage, totalPages, setCurrentPage, paginatedItems };
};
