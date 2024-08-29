// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name?: string,
  msg?: string,
  data?: any
}

type formData = {
  id: number,
  name: string,
  email: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'GET') {
    res.status(200).json({ name: 'John Doe', data: req.query });
  } else {
    res.status(500).json({ msg: "Method Not Supported", data: req.body })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20b"
    }
  }
}
