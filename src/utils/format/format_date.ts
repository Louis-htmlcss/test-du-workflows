/**
 * @example
 * dateAsShortString(new Date('2021-12-31')) // '31/12/2021'
 */
export const dateAsShortString = (date: Date): string => {
  return date.toLocaleDateString("en-GB");
};