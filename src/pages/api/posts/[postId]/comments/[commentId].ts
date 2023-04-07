import { removeComment, updateComment } from "@/lib/dbActions";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const commentId = req.query.commentId as string;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const comment = req.body.comment;
  if (req.method === "PUT") {
    const updatedComment = await updateComment(
      commentId,
      session.user.id,
      comment
    );
    return res.status(200).json({ data: updatedComment });
  }
  if (req.method === "DELETE") {
    const deletedComment = await removeComment(commentId, session.user.id);
    return res.status(200).json({ data: deletedComment });
  }
  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
