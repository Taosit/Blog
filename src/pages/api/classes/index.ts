import { getCoursesAndSemesters } from "@/lib/dbActions";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { courses, semesters } = await getCoursesAndSemesters();
  return res.status(200).json({ data: { courses, semesters } });
};

export default handler;
