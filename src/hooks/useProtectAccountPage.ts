import { userFields } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useProtectAccountPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "loading") {
      return;
    }
    if (!session.data?.user) {
      router.push("/signin");
      return;
    }
    const user = session.data.user as userFields;
    if (
      (user.role === "STUDENT" && user.studentNumber) ||
      user.role === "TEACHER"
    ) {
      router.push(`/user/${user.id}`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
};
