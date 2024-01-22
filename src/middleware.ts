import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utlis";
import { AUTH_ROUTES, LIST_EDIT_PATTERN, PRIVATE_ROUTES } from "./lib/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const { user } = await getServerSideUser(cookies);

  if (user && AUTH_ROUTES.includes(nextUrl.pathname)) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  if (
    !user &&
    (PRIVATE_ROUTES.includes(nextUrl.pathname) ||
      LIST_EDIT_PATTERN.test(nextUrl.pathname))
  ) {
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }/sign-in?origin=${encodeURIComponent(nextUrl.pathname)}`
    );
  }
}
