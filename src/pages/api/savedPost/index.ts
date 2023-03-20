import { uploadToCloudinary } from "@/lib/cloudinary";
import { updateSavedPost } from "@/lib/dbActions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const { userId, post } = req.body;
  if (userId !== session.user.id) return res.status(403);
  if (req.method !== "PUT") return res.status(405);
  if (post.image) {
    post.image = await uploadToCloudinary(post.image);
  }
  const updatedPost = await updateSavedPost(userId, {
    ...post,
    image: post.image?.secure_url,
  }).catch((err) => {
    return res.status(500).json({ error: err.message });
  });
  return res.status(200).json(updatedPost);
};

export default handler;
