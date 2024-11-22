const initialsFromName = (label: string) =>
  label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default initialsFromName;
