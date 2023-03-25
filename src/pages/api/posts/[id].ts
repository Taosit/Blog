import { getPost, removePost, updatePost } from "@/lib/dbActions";
import { savedPostType } from "@/types/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = req.query.id as string;
  if (req.method === "GET") {
    const post = await getPost(postId);
    return res.status(200).json({ data: post });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  if (req.method === "PUT") {
    const post = req.body.post as savedPostType;
    if (post.authorId !== session.user.id) return res.status(403);
    const updatedPost = await updatePost(postId, session.user.id, post);
    return res.status(200).json({ data: updatedPost });
  }
  if (req.method === "DELETE") {
    const deletedPost = await removePost(postId, session.user.id);
    return res.status(200).json({ data: deletedPost });
  }
  return res.status(405);
};

export default handler;
