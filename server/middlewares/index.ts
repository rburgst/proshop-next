import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ErrorHandler } from 'next-connect'

export declare type MiddlewareFunction<REQ extends NextApiRequest = NextApiRequest, T = unknown> = (
  req: REQ,
  res: NextApiResponse<T>,
  next: (res?: unknown) => void
) => void | Promise<void>

export const onError: ErrorHandler<NextApiRequest, NextApiResponse> = (
  err: Record<string, unknown>,
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextApiHandler
) => {
  console.error('error caught in middleware', err)
  const error = res.statusCode === 200 ? 500 : res.statusCode
  res.status(error)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
