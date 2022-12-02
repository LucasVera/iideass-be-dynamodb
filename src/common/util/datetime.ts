/**
 * Helper function to get the timestamp of a date. defaults to now
 * @param date - Date object. Defaults to new Date()
 * @returns Timestamp of the date
 */
export const getUnixTimestamp = (date = new Date()) => {
  return Math.floor(date.getTime() / 1000)
}
