import client from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await client.user.deleteMany();
  await client.color.deleteMany();
  await client.class.deleteMany();

  res.status(200).json({ message: "All User data cleared" });
};

export default handler;
