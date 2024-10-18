export type DayOfWeek = {
  name: string;
  id: string;
  index: number;
};

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { name: "M", id: "Mandag", index: 1 },
  { name: "T", id: "Tirsdag", index: 2 },
  { name: "O", id: "Onsdag", index: 3 },
  { name: "T", id: "Torsdag", index: 4 },
  { name: "F", id: "Fredag", index: 5 },
  { name: "L", id: "Lørdag", index: 6 },
  { name: "S", id: "Søndag", index: 7 },
];
