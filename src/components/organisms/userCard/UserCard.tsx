"use client";

import React, { useEffect, useState } from "react";
import styles from "./UserCard.module.css";
import { User, Class, Post } from "@prisma/client";
import { InputGroup } from "@/components/atoms/inputGroup/InputGroup";
import { getNameError } from "@/lib/helpers";
import { EditIcon } from "./EditIcon";
import CheckmarkIcon from "./CheckmarkIcon";
import { updateUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import CoursesInput from "@/components/atoms/coursesInput/CoursesInput";

type UserCardProps = {
  user: User & {
    classes: Class[];
    posts: Post[];
  };
};

export default function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  useEffect(() => {
    if (user.role === "STUDENT" && !user.studentNumber) {
      router.push("/account");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role]);

  const [data, setData] = useState({
    firstName: user.name?.split(" ")[0] || "",
    lastName: user.name?.split(" ")[1] || "",
    courses: user.classes?.map((classObj) => classObj.name.toUpperCase()) || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const updateUserInfo = async () => {
    await updateUser({
      id: user.id,
      data: { ...data, role: "STUDENT", studentNumber: user.studentNumber! },
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
      <CoursesInput
        value={data.courses}
        disabled={!isEditing}
        setCourses={(courses) => setData((prev) => ({ ...prev, courses }))}
      />
    </div>
  );
}
