// @ts-ignore: no types exist
import formidable from 'formidable-serverless'
import { NextApiResponse } from 'next'
import nc from 'next-connect'
import path from 'path'

import { onError } from '../../server/middlewares'
import { isAdmin, NextApiRequestWithUser, protect } from '../../server/middlewares/authMiddleware'

const fileTypes = ['image/jpeg', 'image/png', 'image/jpg']
const filePrefix = './public/uploads/'
const removePrefix = 'public'

const handler = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse<string>
): Promise<void> => {
  const form = new formidable.IncomingForm()
  form.uploadDir = filePrefix
  form.keepExtensions = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form.onPart = (part: any) => {
    if (fileTypes.indexOf(part.mime) === -1) {
      // Here is the invalid file types will be handled.
      // You can listen on 'error' event
      form._error(new Error('File type is not supported'))
    }
    if (!part.filename || fileTypes.indexOf(part.mime) !== -1) {
      // Let formidable handle the non file-pars and valid file types
      form.handlePart(part)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form.parse(req, (err: Error | undefined, fields: any, files: any) => {
    console.log(err, fields, files)
    if (err) {
      throw err
    } else {
      const filePath = files.image.path
      const resolved = path.resolve(filePath)
      console.log(resolved, resolved)
      const url = filePath.replace(removePrefix, '')
      res.send(url)
    }
  })
}

export default nc({ onError: onError }).post(protect, isAdmin, handler)

export const config = {
  api: {
    bodyParser: false,
  },
}
