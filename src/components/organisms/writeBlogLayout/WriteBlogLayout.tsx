import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { toColorString } from "@/lib/helpers";
import React, { PropsWithChildren, Suspense } from "react";
import styles from "./WriteBlogLayout.module.css";

export default async function WriteBlogLayout({
  children,
}: PropsWithChildren<{}>) {
  return (
    <div className={styles.container}>
      <Suspense fallback={<TopBlock />}>
        {/* @ts-expect-error Server Component */}
        <TopBlockAsync />
      </Suspense>
      <main className={styles.page}>{children}</main>
    </div>
  );
}

function TopBlock() {
  const style = {
    backgroundColor: "#fff",
  };
  return <div className={styles.topBlock} style={style}></div>;
}

async function TopBlockAsync() {
  const session = await getServerSession(authOptions);
  const color = session?.user?.color
    ? toColorString(session.user.color)
    : "#fff";
  const style = {
    backgroundColor: color,
  };
  return <div className={styles.topBlock} style={style}></div>;
}
