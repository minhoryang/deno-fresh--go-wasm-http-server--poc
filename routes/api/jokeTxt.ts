import type { FreshContext } from "$fresh/server.ts";
import { fromFileUrl } from "$std/path/mod.ts";

export const handler = async (
  _req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const text = await Deno.readTextFile(
    fromFileUrl(new URL("./jokes.txt", import.meta.url)),
  );
  const jokes = text.split("\n");
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const body = jokes[randomIndex];
  return new Response(body);
};
