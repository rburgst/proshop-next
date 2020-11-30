import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ErrorHandler } from "next-connect";

export declare type MiddlewareFunction<
  REQ extends NextApiRequest = NextApiRequest,
  T = any
> = (req: REQ, res: NextApiResponse<T>, next: any) => void | Promise<void>;

const logRequestMiddleware: MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next
) => {
  console.log(req.url);
  next();
};

export const onError: ErrorHandler<NextApiRequest, NextApiResponse> = (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  console.error("error caught in middleware", err);
  const error = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(error);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

async function applyMiddleware(
  middleware: MiddlewareFunction,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const result = middleware(req, res, (result: any) => {
    if (result instanceof Error) {
      throw result;
    }
  });
  return result;
}

const withMiddleware = (
  next: NextApiHandler,
  ...aditionalMiddlewares: MiddlewareFunction[]
) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // creates a list of middlewares (not required, but also filters any conditional
    // middlewares based upon current ENV)
    const middlewares = [logRequestMiddleware, ...aditionalMiddlewares].filter(
      Boolean
    );

    // each middleware will then be wrapped within its own promise
    const promises = middlewares.reduce((acc, middleware) => {
      const promise = applyMiddleware(middleware, req, res);
      return [...acc, promise];
    }, []);

    // promised middlewares get asynchronously resolved (this may need to be switched to a synchronous
    // loop if a certain middleware function needs to be resolved before another)
    await Promise.all(promises);

    // returns the next wrapped function(s) to be executed (can be an API route or another additional middleware)
    return await next(req, res);
  } catch (err) {
    console.error("error caught in middleware", err);
    const error = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(error);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
    return;
  }
};
export default withMiddleware;
