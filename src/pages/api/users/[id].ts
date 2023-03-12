import { formatClass, getTerm, isFormInvalid } from "@/lib/helpers";
import client from "@/lib/prismadb";
import { accountFields } from "@/types/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const { firstName, lastName, isStudent, studentNumber, course } =
    req.body as accountFields;
  if (isFormInvalid(req.body)) return res.status(400);
  const term = getTerm();
  const courseName = formatClass(course);
  const upsertClass = await client.class.upsert({
    where: {
      courseIdentifier: {
        name: courseName,
        term: term,
      },
    },
    update: {},
    create: {
      name: courseName,
      term: term,
    },
  });
  console.log({ upsertClass });
  const updateUser = await client.user.update({
    where: { id: req.query.id as string },
    data: {
      name: `${firstName} ${lastName}`,
      role: isStudent === "Yes" ? "STUDENT" : "TEACHER",
      classId: upsertClass.id,
      studentNumber: studentNumber || null,
    },
  });
  console.log({ updateUser });
  res.status(200).json({ message: "it works" });
};

export default handler;
