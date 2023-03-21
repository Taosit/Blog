"use client";

import React, { useEffect, useState } from "react";
import styles from "./UserCard.module.css";
import { User, Class, Post } from "@prisma/client";
import { InputGroup } from "@/components/atoms/inputGroup/InputGroup";
import { formatClass, getNameError, isCourseValid } from "@/lib/helpers";
import { EditIcon } from "./EditIcon";
import CheckmarkIcon from "./CheckmarkIcon";
import { updateUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import TagsInputGroup from "@/components/atoms/tagsInputGroup/TagsInputGroup";
import { useSession } from "next-auth/react";
import { userFields } from "@/types/types";

type UserType = {
  firstName: string;
  lastName: string;
  courses: string[];
};

type UserCardProps = {
  userPromise: Promise<
    User & {
      classes: Class[];
      posts: Post[];
    }
  >;
};

export default function UserCard({ userPromise }: UserCardProps) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.data?.user) return;
    const user = session.data.user as userFields;
    if (user.role === "STUDENT" && !user.studentNumber) {
      router.push("/account");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const [data, setData] = useState<UserType>({
    firstName: "",
    lastName: "",
    courses: [],
  });

  useEffect(() => {
    userPromise.then((user) => {
      const courses = user.classes?.map((classObj) =>
        classObj.name.toUpperCase()
      );
      setData({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        courses: courses || [],
      });
    });
  }, [userPromise]);

  const [isEditing, setIsEditing] = useState(false);

  const updateUserInfo = async () => {
    const user = session.data!.user as userFields;
    await updateUser({
      id: user.id,
      data: {
        ...data,
        role: "STUDENT",
        studentNumber: user.studentNumber!,
      },
    });
    setIsEditing(false);
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
