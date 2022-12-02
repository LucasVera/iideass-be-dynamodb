import { IdeaType } from "@common/models/Idea"
import { validatePropIsInEnum, validateRequiredProp, ValidationMessages } from "@common/util/validations"
import { FromSchema } from "json-schema-to-ts"
import schema from "./schema"

export const validateInput = (body: FromSchema<typeof schema>) => {
  const {
    description,
    email,
    subject,
    type,
  } = body

  const requiredProps = [
    { prop: description, errMsg: 'Description is required.' },
    { prop: email, errMsg: ValidationMessages.EMAIL_IS_REQUIRED, },
    { prop: subject, errMsg: 'Subject is required.' },
    { prop: type, errMsg: 'Type is required.' },
  ]
  requiredProps.forEach(({ prop, errMsg }) => validateRequiredProp(prop, errMsg))

  validatePropIsInEnum(IdeaType, type, `Type of idea is not valid. Valid values are: ${Object.values(IdeaType)}.`)
}
