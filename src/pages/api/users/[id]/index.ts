import { getUser } from "@/lib/dbActions";
import { updateBasicUserInfo, updateStudentCourses } from "@/lib/dbActions";
import { isUserUpdateSubmissionInvalid } from "@/lib/helpers";
import { userUpdateFields } from "@/types/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  if (req.query.id !== session.user.id) return res.status(403);
  if (req.method === "GET") {
    const user = await getUser(req.query.id as string);
    return res.status(200).json({ data: user });
  }
  if (req.method !== "PUT") return res.status(405);

  const { firstName, lastName, role, studentNumber, courses, color } =
    req.body as userUpdateFields;
  if (isUserUpdateSubmissionInvalid(req.body)) return res.status(400);
  const userId = req.query.id as string;
  const user = await updateBasicUserInfo(
    userId,
    `${firstName} ${lastName}`,
    role,
    studentNumber,
    color
  );
  // if (color) await updateColor(userId, color);
  await updateStudentCourses(userId, courses);

  res.status(200).json({ user: { ...user, courses } });
};

export default handler;
