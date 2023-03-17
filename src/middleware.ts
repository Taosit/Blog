// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      return (
        req.cookies.has("next-auth.session-token") ||
        req.cookies.has("__Secure-next-auth.session-token")
      );
      // console.log({ token });
      // return !!token;
    },
  },
});

export const config = {
  matcher: ["/account", "/user/:path*"],
};
