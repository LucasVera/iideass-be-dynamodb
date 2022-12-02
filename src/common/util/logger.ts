import { inspect } from 'util'

/**
 * Helper util to log messages. It can be extended in the future to handle
 * Log levels, different log targets (files, cloud, third-party)
 * @param message (string) - Message to log
 * @param rest (any) - Rest of data to log
 */
export const logMessage = (message: string, ...rest) => {
  let msgToLog = message
  if (rest) msgToLog += ` - ${inspect(rest)}`

  console.log(new Date().toISOString(), msgToLog)
}
