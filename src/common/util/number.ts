import { getUnixTimestamp } from "./datetime";

/**
 * Helper function to generate a random number, using timestamp and random integer
 * @returns random number
 */
export const generateRandom = (): number => Number(`${getUnixTimestamp()}${Math.round((Math.random() * 1000))}`)
