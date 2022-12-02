import { validateRequiredProp, ValidationMessages } from '@common/util/validations'
import { FromSchema } from 'json-schema-to-ts'
import schema from './schema'

export const validateInput = (query: FromSchema<typeof schema>) => {
  const { email } = query

  const requiredProps = [{ prop: email, errMsg: ValidationMessages.EMAIL_IS_REQUIRED }]
  requiredProps.forEach(({ prop, errMsg }) => validateRequiredProp(prop, errMsg))
}
