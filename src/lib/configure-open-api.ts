import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPi } from "./types.ts";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenApi(app: AppOpenAPi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: packageJSON.version,
    },
  });

  app.get("/reference", apiReference({
    theme: "kepler",
    layout: "classic",
    defaultHttpClient: {
      targetKey: "node",
      clientKey: "fetch",
    },
    spec: {
      url: "/doc",
    },
  }));
}
