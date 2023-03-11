"use client";

import { InputGroup } from "@/components/atoms/inputGroup/InputGroup";
import {
  getCourseError,
  getNameError,
  getStudentNumberError,
} from "@/lib/helpers";
import { accountFields } from "@/types/types";
import React from "react";

type StudentProps = {
  data: accountFields;
  setData: React.Dispatch<React.SetStateAction<accountFields>>;
};

export const StudentAccountFields = ({ data, setData }: StudentProps) => {
  return (
    <>
      <InputGroup
        label="Student Number"
        value={data.studentNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setData((prev) => ({ ...prev, studentNumber: e.target.value }))
        }
        validate={getStudentNumberError}
      />
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
      <InputGroup
        label="What course are your blog articles for?"
        value={data.course}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setData((prev) => ({ ...prev, course: e.target.value }))
        }
        validate={getCourseError}
      />
    </>
  );
};
