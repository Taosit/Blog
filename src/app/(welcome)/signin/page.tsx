"use client";

import { Button } from "@/components/atoms/button/Button";
import { InputGroup } from "@/components/atoms/inputGroup/InputGroup";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Signin.module.css";
import google from "./google.svg";
import { getEmailError } from "@/lib/helpers";
import { useSearchParams } from "next/navigation";

const Signin = () => {
  const [email, setEmail] = useState("");

  const searchParams = useSearchParams();

  const messageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchParams?.get("verifyEmail") || !messageRef.current) return;
    messageRef.current.style.display = "block";
  }, [searchParams, messageRef]);

  const signinOptions = {
    redirect: true,
    callbackUrl: searchParams?.get("callbackUrl") || "/",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !getEmailError(email)) {
      signIn("email", signinOptions);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign In</h1>
      <InputGroup
        label="Please enter your email"
        type="email"
        value={email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        validate={getEmailError}
      />
      <Button
        className={styles.emailButton}
        onClick={() => signIn("email", { email, ...signinOptions })}
        disabled={!!getEmailError(email)}
      >
        Sign in with Email
      </Button>
      <div className={styles.separatorContainer}>
        <p>OR</p>
      </div>
      <Button
        className={styles.googleButton}
        onClick={() => signIn("google", signinOptions)}
      >
        <Image src={google} width={20} height={20} alt="google" />
        <p>Sign in with Google</p>
      </Button>
      <div ref={messageRef} className={styles.messageContainer}>
        <p className={styles.verificationMessage}>
          An email has been sent. Please check your inbox to sign in.
        </p>
      </div>
    </div>
  );
};

export default Signin;
