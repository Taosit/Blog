import client from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await client.savedPost.deleteMany();
  await client.post.deleteMany();
  await client.user.deleteMany();
  await client.class.deleteMany();

  res.status(200).json({ message: "All data cleared" });
};

export default handler;
