import WriteBlogLayout from "@/components/organisms/writeBlogLayout/WriteBlogLayout";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    // @ts-expect-error Server Component
    <WriteBlogLayout>{children}</WriteBlogLayout>
  );
}
