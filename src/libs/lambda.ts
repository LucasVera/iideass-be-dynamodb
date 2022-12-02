import middy from '@middy/core'
import bodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { validateEmptyBodyMiddleware } from '@common/middlewares/validateEmptyBody'
import { validateEmptyQueryStringMiddleware } from '@common/middlewares/validateEmptyQueryString'

export interface CustomMiddlewares {
  validateEmptyBody?: boolean
  validateEmptyQueryString?: boolean
}

export const middyfy = (handler, customMiddlewares?: CustomMiddlewares) => {
  const middlewares = [bodyParser(), cors()]

  if (customMiddlewares) {
    const {
      validateEmptyBody,
      validateEmptyQueryString
    } = customMiddlewares

    if (validateEmptyBody) middlewares.push(validateEmptyBodyMiddleware())
    if (validateEmptyQueryString) middlewares.push(validateEmptyQueryStringMiddleware())
  }

  return middy(handler).use(middlewares)
}
