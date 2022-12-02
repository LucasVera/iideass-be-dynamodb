import { FromSchema } from "json-schema-to-ts"
import schema from "./schema"

export const validateInput = (body: FromSchema<typeof schema>) => {
  return true
}
