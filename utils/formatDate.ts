export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
};
