const leadingZero = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

const getAbsenceTime = (fromTimestamp: number, toTimestamp: number) => {
  const from = new Date(fromTimestamp);
  const to = new Date(toTimestamp);
  const diff = to.getTime() - from.getTime();
  return {
    diff: diff,
    hours: Math.floor(diff / 1000 / 60 / 60),
    withMinutes: leadingZero(Math.floor(diff / 1000 / 60) % 60),
    minutes: Math.floor(diff / 1000 / 60),
  };
};

export { getAbsenceTime, leadingZero };