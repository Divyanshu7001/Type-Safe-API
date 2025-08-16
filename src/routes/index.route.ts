import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createRouter } from "@/lib/create-app.ts";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        //   z.object({
        //     message: z.string(),
        //   }) ,
        createMessageObjectSchema("Welcome to Tasks API Index"),
        "Welcome to Tasks API Index",
      ),
    },
  },
  ),
  (c) => {
    return c.json({ message: "Welcome to Tasks API Index" }, HttpStatusCodes.OK);
  },
);

export default router;

// EXAMPLE OF HOW THE ROUTES SHOULD BE WRITTEN
// const router = createRouter().openapi(createRoute({
//   method: "get",
//   path: "/",
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             message: z.string(),
//           }),
//         },
//       },
//       description: "Welcome to Tasks API Index",
//     },
//   },
// }),
//   (c)=>{
//     return c.json({ message: "Welcome to Tasks API Index" });
//   }
// );
