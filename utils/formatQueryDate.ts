const formatQueryDate = (date: Date): string => {
  return date.toISOString().split('T')[0].replaceAll('-', '/');
};

export default formatQueryDate;
