import { IdeaType } from '@common/models/Idea'
import { validatePropIsInEnum, validateRequiredProp, ValidationMessages } from '@common/util/validations'
import { FromSchema } from 'json-schema-to-ts'
import schema from './schema'

export const validateInput = (body: FromSchema<typeof schema>) => {
  const { description, email, subject, ideaType } = body

  const requiredProps = [
    { prop: description, errMsg: 'Description is required.' },
    { prop: email, errMsg: ValidationMessages.EMAIL_IS_REQUIRED },
    { prop: subject, errMsg: ValidationMessages.SUBJECT_IS_REQUIRED },
    { prop: ideaType, errMsg: 'Idea type is required.' },
  ]
  requiredProps.forEach(({ prop, errMsg }) => validateRequiredProp(prop, errMsg))

  validatePropIsInEnum(IdeaType, ideaType, `Type of idea is not valid. Valid values are: ${Object.values(IdeaType)}.`)
}
