import { getAllPosts, postComment } from "@/lib/dbActions";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const { comment } = req.body;
  if (!session.user.id) return res.status(403).json({ error: "Forbidden" });
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  if (!comment) {
    return res.status(400).json({ error: "No post data" });
  }
  const postId = req.query.postId as string;
  postComment(session.user.id, postId, comment)
    .then((newComment) => {
      return res.status(200).json({ data: newComment });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.message });
    });
};

export default handler;
