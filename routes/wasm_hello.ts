import type { FreshContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const index = await fetch(
    "https://raw.githubusercontent.com/nlepage/go-wasm-http-server/v1.1.0/docs/hello-state/index.html",
  );
  const resp = new Response(index.body);
  resp.headers.set("Content-Type", "text/html");
  return resp;
};
