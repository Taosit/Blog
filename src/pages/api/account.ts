import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  //   if (req.method !== "POST") return res.status(400);
  console.log("Session", JSON.stringify(session, null, 2));
  res.status(200).json({ message: "it works" });
};

export default handler;
