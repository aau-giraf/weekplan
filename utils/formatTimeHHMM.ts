const formatTimeHHMM = (date: Date) => {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatTimeHHMM;
