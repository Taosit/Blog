"use client";
import { Radio } from "@/components/atoms/radio/Radio";
import {
  getCourseError,
  getNameError,
  getStudentNumberError,
} from "@/lib/helpers";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Account.module.css";
import chevronRight from "./chevron-right.svg";
import { useRouter } from "next/navigation";
import { accountFields } from "@/types/types";
import { StudentAccountFields } from "@/components/organisms/studentAccountFields/StudentAccountFields";
import { ProfessorAccountFields } from "@/components/organisms/professorAccountFields/ProfessorAccountFields";

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

  const formRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!formRef.current) return;
    formRef.current.scrollIntoView();
  }, [formRef]);

  const selectIsStudent = (choice: string) => {
    setStudentSelectError("");
    setData((prev) => ({ ...prev, isStudent: choice }));
  };

  const isInvalid =
    data.isStudent === "" ||
    (data.isStudent === "No" && data.isProfessor === "") ||
    (data.isStudent === "Yes" && getStudentNumberError(data.studentNumber)) ||
    getNameError(data.firstName, "first") ||
    getNameError(data.lastName, "last") ||
    getCourseError(data.course);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.isStudent === "") {
      setStudentSelectError("This field must be selected");
      return;
    }
    if (data.isStudent === "No" && data.isProfessor === "") {
      setProfessorSelectError("This field must be selected");
      return;
    }
    if (isInvalid) return;
    router.push("./profile");
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
