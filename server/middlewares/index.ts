import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const {
  cookieKey,
  DOMAIN,
  inDevelopment,
  inProduction,
  inStaging,
} = process.env;

const helloMiddleware = (req: NextApiRequest, res: NextApiResponse, next) => {
  console.log(req.url);
  next();
};

const withMiddleware = (next: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    // creates a list of middlewares (not required, but also filters any conditional
    // middlewares based upon current ENV)
    const middlewares = [helloMiddleware].filter(Boolean);

    // each middleware will then be wrapped within its own promise
    const promises = middlewares.reduce((acc, middleware) => {
      const promise = new Promise((resolve, reject) => {
        middleware(req, res, (result: any) =>
          result instanceof Error ? reject(result) : resolve(result)
        );
      });
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
