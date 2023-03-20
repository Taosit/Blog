import { updateUserColor } from "@/lib/dbActions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  if (req.query.id !== session.user.id) return res.status(403);
  if (req.method !== "PUT") return res.status(405);
  const user = await updateUserColor(req.query.id as string, req.body.color);
  return res.status(200).json({ data: user.color });
};

export default handler;
