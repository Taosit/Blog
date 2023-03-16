import { updateColor } from "@/lib/dbActions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const { color, userId } = req.body;
  await updateColor(userId, color);

  res.status(200).json({ message: "it works" });
};

export default handler;
