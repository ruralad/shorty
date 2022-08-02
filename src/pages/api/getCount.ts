import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../db/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const recordCount = await prisma.shortLink.count();
  return res.json({ count: recordCount });
};
