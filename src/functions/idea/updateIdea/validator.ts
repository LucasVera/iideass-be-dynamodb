import { BadInputError } from "@common/errors/CustomError"
import { IdeaType } from "@common/models/Idea"
import { validatePropIsInEnum, validateRequiredProp, ValidationMessages } from "@common/util/validations"
import { FromSchema } from "json-schema-to-ts"
import schema from "./schema"

export const validateInput = (body: FromSchema<typeof schema>) => {
  const {
    email,
    subject,
    description,
    ideaType,
  } = body

  const requiredProps = [
    { prop: email, errMsg: ValidationMessages.EMAIL_IS_REQUIRED, },
    { prop: subject, errMsg: 'Subject is required.' },
  ]
  requiredProps.forEach(({ prop, errMsg }) => validateRequiredProp(prop, errMsg))

  if (!description && !ideaType) throw new BadInputError('At least one field should be specified for update: description or type', { description, ideaType })

  if (ideaType) validatePropIsInEnum(IdeaType, ideaType, `Type of idea is not valid. Valid values are: ${Object.values(IdeaType)}.`)
}
