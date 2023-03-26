import { uploadToCloudinary } from "@/lib/cloudinary";
import { deleteSavedPost, getAllPosts, postBlog } from "@/lib/dbActions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const posts = await getAllPosts(req.query);
    return res.status(200).json({ data: posts });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const { userId, post } = req.body;
  if (userId !== session.user.id) return res.status(403);
  if (req.method !== "POST") return res.status(405);
  if (!post) {
    return res.status(400).json({ error: "No post data" });
  }
  if (post.image && !post.image.startsWith("http")) {
    const image = await uploadToCloudinary(post.image);
    post.image = image.secure_url;
  }
  postBlog(userId, post)
    .then((newPost) => {
      deleteSavedPost(userId);
      return res.status(200).json({ data: newPost });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.message });
    });
};

export default handler;
