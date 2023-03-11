import { WelcomeSidebar } from "@/components/organisms/welcomeSidebar/WelcomeSidebar";
import { PropsWithChildren } from "react";
import styles from "./layout.module.css";

type Props = {};

export default function RootLayout({ children }: PropsWithChildren<Props>) {
  return (
    <div className={styles.container}>
      <WelcomeSidebar />
      <div className={styles.contentContainer}>
        <main>{children}</main>
      </div>
    </div>
  );
}
