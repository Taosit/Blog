import { uploadToCloudinary } from "@/lib/cloudinary";
import { updateAvatar } from "@/lib/dbActions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const { image, userId } = req.body;
  const imageUrl = await uploadToCloudinary(image);
  await updateAvatar(userId, imageUrl.secure_url);

  res.status(200).json({ data: imageUrl });
};

export default handler;
