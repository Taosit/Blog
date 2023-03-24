import { uploadToCloudinary } from "@/lib/cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const { image } = req.body;
  if (!image) res.status(400).json({ error: "No image provided" });
  const imageUrl = await uploadToCloudinary(image);

  return res.status(200).json({ data: imageUrl.secure_url });
};

export default handler;
