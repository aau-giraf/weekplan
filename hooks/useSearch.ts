import { useMemo } from "react";

type SearchFunction<T> = (item: T) => string;

/**
 * Custom hook to filter a list of items based on a search query.
 * It uses memoization to optimize filtering by recalculating only when dependencies change.
 *
 * @template T - The type of the items in the list.
 * @param {T[]} items - The array of items to filter.
 * @param {string} searchQuery - The search query used to filter items. If empty, all items are returned.
 * @param {SearchFunction<T>} searchFn - A function that extracts a searchable string from each item.
 *
 * @returns {T[]} A filtered array of items that match the search query.
 */
const useSearch = <T>(items: T[], searchQuery: string, searchFn: SearchFunction<T>) => {
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    const lowercasedTerm = searchQuery.toLowerCase();

    return items.filter((item) => {
      const searchableText = searchFn(item).toLowerCase();
      return searchableText.includes(lowercasedTerm);
    });
  }, [items, searchQuery, searchFn]);

  return filteredItems;
};

export default useSearch;
