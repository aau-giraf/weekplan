import { useMemo } from "react";

type SearchFunction<T> = (item: T) => string;

const useSearch = <T>(items: T[], searchQuery: string, searchFn: SearchFunction<T>) => {
  return useMemo(() => {
    if (!searchQuery) return items;

    const lowercasedTerm = searchQuery.toLowerCase();

    return items.filter((item) => {
      const searchableText = searchFn(item).toLowerCase();
      return searchableText.includes(lowercasedTerm);
    });
  }, [items, searchQuery, searchFn]);
};

export default useSearch;
