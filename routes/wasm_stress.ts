import type { FreshContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const index = await fetch(
    "https://raw.githubusercontent.com/xiaobai-world/go-wasm-http-server/master/docs/simulate-large-file/index.html",
  );
  const resp = new Response(index.body);
  resp.headers.set("Content-Type", "text/html");
  return resp;
};

// FIXME: huge memory consumtion on /api/create-file-by-size
