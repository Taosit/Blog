"use client";

import React, { useEffect, useState } from "react";
import styles from "./UserCard.module.css";
import { InputGroup } from "@/components/atoms/inputGroup/InputGroup";
import { formatClass, getNameError, isCourseValid } from "@/lib/helpers";
import { EditIcon } from "./EditIcon";
import CheckmarkIcon from "./CheckmarkIcon";
import { useRouter } from "next/navigation";
import TagsInputGroup from "@/components/atoms/tagsInputGroup/TagsInputGroup";
import { useSession } from "next-auth/react";
import { trpc } from "@/providers/TrpcProvider";

type UserType = {
  firstName: string;
  lastName: string;
  courses: string[];
};

type UserCardProps = {
  userId: string;
};

export default function UserCard({ userId }: UserCardProps) {
  const router = useRouter();
  const session = useSession();

  const { data: user } = trpc.user.getUser.useQuery({
    userId,
  });
  const userMutation = trpc.user.updateBasicUserInfo.useMutation();

  const [data, setData] = useState<UserType>({
    firstName: "",
    lastName: "",
    courses: [],
  });

  useEffect(() => {
    if (!session.data?.user || !user) return;
    if (user.role === "STUDENT" && !user.studentNumber) {
      router.push("/account");
    }
    const courses = user.classes?.map((classObj) =>
      classObj.name.toUpperCase()
    );
    setData({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      courses: courses || [],
    });
  }, [session, user]);

  const [isEditing, setIsEditing] = useState(false);

  const updateUserInfo = () => {
    userMutation.mutate(
      {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        courses: data.courses,
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.column}>
        {isEditing ? (
          <CheckmarkIcon onClick={updateUserInfo} className={styles.icon} />
        ) : (
          <EditIcon
            onClick={() => setIsEditing(true)}
            className={styles.icon}
          />
        )}
        <InputGroup
          label="First Name"
          id="user-first"
          value={data.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData((prev) => ({ ...prev, firstName: e.target.value }))
          }
          disabled={!isEditing}
          validate={(str) => getNameError(str, "first")}
        />
        <InputGroup
          label="Last Name"
          id="user-last"
          value={data.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData((prev) => ({ ...prev, lastName: e.target.value }))
          }
          disabled={!isEditing}
          validate={(str) => getNameError(str, "last")}
        />
      </div>
      <TagsInputGroup
        value={data.courses}
        disabled={!isEditing}
        setTags={(courses) => setData((prev) => ({ ...prev, courses }))}
        validateEach={isCourseValid}
        formatEach={(str) => formatClass(str).toUpperCase()}
      />
    </div>
  );
}
