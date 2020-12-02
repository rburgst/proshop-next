// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import { onError } from '../../../server/middlewares'

const getPaypalId = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.json(process.env.PAYPAL_CLIENT_ID)
}
export default nc({ onError: onError }).get(getPaypalId)
