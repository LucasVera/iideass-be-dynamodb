import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ApiGatewayEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const formatJSONResponse = (response: ApiResponse): ApiGatewayResponse => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

interface ResponseBody {
  success: boolean
  data?: object
  error?: string
}

interface ApiResponse {
  statusCode?: number
  body: ResponseBody
}

export interface ApiGatewayResponse {
  statusCode: number
  body: string
}

export const successResponse = (data: any): ApiGatewayResponse =>
  formatJSONResponse({
    statusCode: 200,
    body: {
      success: true,
      data,
    },
  })

export const errorResponse = (statusCode: number, error: string): ApiGatewayResponse =>
  formatJSONResponse({
    statusCode,
    body: {
      success: false,
      error,
    },
  })
