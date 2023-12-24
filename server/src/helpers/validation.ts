import { type Request, type Response } from 'express'
import { z } from 'zod'

const validate = (
  req: Request,
  res: Response,
  dataSchema: z.ZodObject<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
): boolean => {
  try {
    dataSchema.parse(req.body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = mapErrors(error.issues)
      res.status(422).json(errors)

      return false
    }

    res.status(500).json({ message: 'Something went wrong' })

    return false
  }

  return true
}

const mapErrors = (errors: Array<z.ZodIssue>): ErrorResponse => {
  let mappedErrors = {}

  errors.forEach((error) => {
    mappedErrors = {
      ...mappedErrors,
      [error.path[0] ?? 'Request Body']: error.message,
    }
  })

  return { errors: mappedErrors }
}

type ErrorResponse = {
  errors: {
    [key: string]: string,
  }
}


export {
  validate,
}
