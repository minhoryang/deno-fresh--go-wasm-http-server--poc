import type { FreshContext } from "$fresh/server.ts";
import type { GlobalThis } from "https://deno.land/x/fest@4.13.2/source/global-this.d.ts";
import { fromFileUrl } from "$std/path/mod.ts";
import "https://cdn.jsdelivr.net/gh/golang/go@go1.18.4/misc/wasm/wasm_exec.js"; // NOTE: globalThis.Go // FIXME: isolated required

type GoWasmHttpGlobals = GlobalThis & {
  // deno-lint-ignore no-explicit-any
  readonly Go: any;
  wasmhttp: object | undefined;
};

export const handler = async (
  _req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const prefetchedBody = await _req.bytes();
  const strippedReq = {
    url: _req.url,
    method: _req.method,
    headers: _req.headers,
    arrayBuffer: async () => await prefetchedBody.buffer,
  };

  const go = new (globalThis as GoWasmHttpGlobals).Go();

  const initiatedWASM = Deno.readFile(
    fromFileUrl(new URL("./create-file-by-size.wasm", import.meta.url)),  // NOTE: this will eat all of your memory.
  ).then((wasmCode) => {
    return WebAssembly.instantiate(wasmCode, go.importObject);
  }).catch(() => {
    return WebAssembly.instantiateStreaming(
      fetch(
        "https://esm.sh/gh/minhoryang/go-wasm-http-server@master/docs/simulate-large-file/api.wasm",
      ),
      go.importObject,
    );
  });
  
  return initiatedWASM
    .then(({ instance }) => {
      return new Promise<Response>((resolve, reject) => {
        (globalThis as GoWasmHttpGlobals).wasmhttp = {
          path: "/api/",
          setHandler: (handler: CallableFunction) => {
            (globalThis as GoWasmHttpGlobals).wasmhttp = undefined;
            handler(strippedReq)
              .then(resolve)
              .catch(reject);
          },
        };
        go.run(instance);
      });
    });
};
