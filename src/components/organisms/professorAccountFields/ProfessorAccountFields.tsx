"use client";

import CoursesInput from "@/components/atoms/coursesInput/CoursesInput";
import { InputGroup } from "@/components/atoms/inputGroup/InputGroup";
import { Radio } from "@/components/atoms/radio/Radio";
import { getCoursesError, getNameError } from "@/lib/helpers";
import { accountFields } from "@/types/types";
import React, { useRef } from "react";
import styles from "./ProfessorAccountFields.module.css";

type ProfessorProps = {
  data: accountFields;
  setData: React.Dispatch<React.SetStateAction<accountFields>>;
  professorSelectError: string;
  setProfessorSelectError: React.Dispatch<React.SetStateAction<string>>;
};

export const ProfessorAccountFields = ({
  data,
  setData,
  professorSelectError,
  setProfessorSelectError,
}: ProfessorProps) => {
  const selectIsProfessor = (choice: string) => {
    setProfessorSelectError("");
    setData((prev) => ({ ...prev, isProfessor: choice }));
  };

  return (
    <>
      <div className={styles.radioContainer}>
        <label>Are you a professor at UBC?</label>
        <Radio
          key="professor radio"
          className={styles.radio}
          items={["No", "Yes"]}
          onSelectItem={selectIsProfessor}
        />
        <p className={styles.error}>{professorSelectError}</p>
      </div>
      {data.isProfessor === "" || data.isProfessor === "Yes" ? (
        <>
          <InputGroup
            label="First Name"
            value={data.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            validate={(str) => getNameError(str, "first")}
          />
          <InputGroup
            label="Last Name"
            value={data.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            validate={(str) => getNameError(str, "last")}
          />
          <CoursesInput
            label="What courses are you using the platform for?"
            value={data.courses}
            setCourses={(courses) => setData((prev) => ({ ...prev, courses }))}
            validate={getCoursesError}
          />{" "}
        </>
      ) : (
        <p>Sorry, this platform is only for UBC students and professors.</p>
      )}
    </>
  );
};
