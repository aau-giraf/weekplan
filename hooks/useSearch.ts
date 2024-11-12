import { useMemo } from "react";

const useSearch = <T extends { firstName: string; lastName: string }>(items: T[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery) return items;

    const lowercasedTerm = searchQuery.toLowerCase();

    return items.filter((item) => {
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      return fullName.includes(lowercasedTerm);
    });
  }, [items, searchQuery]);
};

export default useSearch;
