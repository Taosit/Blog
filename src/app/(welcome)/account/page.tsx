"use client";
import { Radio } from "@/components/atoms/radio/Radio";
import { isFormInvalid } from "@/lib/helpers";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Account.module.css";
import chevronRight from "./chevron-right.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { accountFields, userFields } from "@/types/types";
import { StudentAccountFields } from "@/components/organisms/studentAccountFields/StudentAccountFields";
import { ProfessorAccountFields } from "@/components/organisms/professorAccountFields/ProfessorAccountFields";
import { useSession } from "next-auth/react";
import { updateUser } from "@/lib/api";

const Account = () => {
  const initialData = {
    isStudent: "",
    isProfessor: "",
    studentNumber: "",
    firstName: "",
    lastName: "",
    course: "",
  };

  const [data, setData] = useState<accountFields>(initialData);
  const [studentSelectError, setStudentSelectError] = useState("");
  const [professorSelectError, setProfessorSelectError] = useState("");

  const session = useSession();
  console.log({ session });

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!formRef.current) return;
    formRef.current.scrollIntoView();
  }, [formRef]);

  useEffect(() => {
    if (session.status === "loading") {
      console.log("loading");
      return;
    }
    if (!session.data?.user) {
      router.push("/signin");
      return;
    }
    if (!session.data.user.name) return;
    const [firstName, lastName] = session.data.user.name.split(" ");
    setData((prev) => ({ ...prev, firstName, lastName }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const selectIsStudent = (choice: string) => {
    setStudentSelectError("");
    setData((prev) => ({ ...prev, isStudent: choice }));
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session.data?.user) return;
    if (data.isStudent === "") {
      setStudentSelectError("This field must be selected");
      return;
    }
    if (data.isStudent === "No" && data.isProfessor === "") {
      setProfessorSelectError("This field must be selected");
      return;
    }
    if (isFormInvalid(data)) return;
    const user = session.data.user as userFields;
    updateUser({ id: user.id, data })
      .then((data) => {
        console.log(data);
        const callbackUrl = searchParams?.get("callbackUrl") || "/profile";
        console.log({ callbackUrl });
        router.push(callbackUrl);
      })
      .catch((e) => console.log(e));
  };

  return (
    <form ref={formRef} className={styles.container} onSubmit={submitForm}>
      <h1 className={styles.title}>Account</h1>
      <div className={styles.formFields}>
        <div className={styles.radioContainer}>
          <label>Are you a UBC student?</label>
          <Radio
            key="student radio"
            className={styles.radio}
            items={["No", "Yes"]}
            onSelectItem={selectIsStudent}
          />
          <p className={styles.error}>{studentSelectError}</p>
        </div>
        {data.isStudent === "" || data.isStudent === "Yes" ? (
          <StudentAccountFields data={data} setData={setData} />
        ) : (
          <ProfessorAccountFields
            data={data}
            setData={setData}
            professorSelectError={professorSelectError}
            setProfessorSelectError={setProfessorSelectError}
          />
        )}
      </div>
      {!(data.isStudent === "No" && data.isProfessor === "No") && (
        <button className={styles.finishButton} type="submit">
          <p>Finish</p>
          <Image src={chevronRight} alt="chevron right" />
        </button>
      )}
    </form>
  );
};

export default Account;
