import middy from '@middy/core'
import bodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { validateEmptyBodyMiddleware } from '@common/middlewares/validateEmptyBody'

export interface CustomMiddlewares {
  validateEmptyBody?: boolean
}

export const middyfy = (handler, customMiddlewares?: CustomMiddlewares) => {
  const middlewares = [bodyParser(), cors()]

  if (customMiddlewares) {
    const {
      validateEmptyBody
    } = customMiddlewares

    if (validateEmptyBody) middlewares.push(validateEmptyBodyMiddleware())
  }

  return middy(handler).use(middlewares)
}
