"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState("");

  return (
    <div>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => signIn("email", { email, redirect: false })}>
        Sign in with Email
      </button>
    </div>
  );
};

export default Signin;
