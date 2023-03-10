// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      return req.cookies.has("next-auth.session-token");
      // console.log({ token });
      // return !!token;
    },
  },
  secret: "hperfidlz",
});

export const config = {
  matcher: ["/account", "/profile"],
};
