import { BadInputError } from '@common/errors/CustomError'

/**
 * Helps validating a prop is required.
 * @param prop (any) - property to validate
 * @param errMsg (string) - error msg to put in error object
 */
export const validateRequiredProp = (prop: any, errMsg: string): void => {
  if (!prop) throw new BadInputError(errMsg, { prop })
}

/**
 * Validates that a given prop exists in an string enum. throws error if it doesn't
 * @param enumeration (enum) - Enumeration to check. must be a string enumeration
 * @param prop (string) - value to check for
 * @param errMsg (string) - Error message in case validation throws error
 */
export const validatePropIsInEnum = (enumeration: any, prop: any, errMsg): void => {
  const isValid = Object.values(enumeration)
    .map((p: string) => p.toLowerCase())
    .includes(prop.toLowerCase() as any)
  if (!isValid) throw new BadInputError(errMsg, { prop })
}

export const ValidationMessages = {
  EMAIL_IS_REQUIRED: 'Email is required.',
  SUBJECT_IS_REQUIRED: 'Subject is required.',
}
