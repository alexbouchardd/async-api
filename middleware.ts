import { NextRequest, NextResponse } from "next/server";
import * as proxy from "./services/proxy";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  const api = checkProxyPath(url);
  if (!api) return NextResponse.next();

  const hookdeckUrl = await proxy.getApi(api);
  if (!hookdeckUrl) return new NextResponse("API not found", { status: 404 });

  const newUrl = createForwardingHookdeckUrl(url);

  return NextResponse.rewrite(newUrl, { ...request });

  function createForwardingHookdeckUrl(url: URL) {
    const newUrl = new URL(
      url.toString().replace(`${url.origin}/${api}/proxy`, hookdeckUrl)
    );
    const searchParams = new URLSearchParams(url.search);
    if (request.method === "GET")
      searchParams.append("x-hookdeck-allow-methods", "GET");
    newUrl.search = searchParams.toString();

    return newUrl;
  }
}

function checkProxyPath(url: URL) {
  const splittedPathname = url.pathname.split("/");
  if (splittedPathname[2] !== "proxy") return undefined;

  return splittedPathname[1] as string;
}
