import {
  updateBasicUserInfo,
  updateColor,
  updateStudentCourses,
} from "@/lib/dbActions";
import { isUserUpdateSubmissionValid } from "@/lib/helpers";
import client from "@/lib/prismadb";
import { userUpdateFields } from "@/types/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const { firstName, lastName, role, studentNumber, courses, color } =
    req.body as userUpdateFields;
  if (isUserUpdateSubmissionValid(req.body)) return res.status(400);
  const userId = req.query.id as string;
  await updateBasicUserInfo(
    userId,
    `${firstName} ${lastName}`,
    role,
    studentNumber
  );
  if (color) await updateColor(userId, color);
  await updateStudentCourses(userId, courses);

  res.status(200).json({ message: "it works" });
};

export default handler;
