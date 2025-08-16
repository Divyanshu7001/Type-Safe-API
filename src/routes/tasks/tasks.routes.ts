import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertTaskSchema, patchTaskSchema, selectTaskSchema } from "@/db/schema.ts";
import { notFoundSchema } from "@/lib/constants.ts";

const tags = ["Tasks"];

export const list = createRoute({
  tags,
  path: "/tasks",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTaskSchema),
      "List of tasks",
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertTaskSchema,
      "The Task to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTaskSchema,
      "The Created Task",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTaskSchema),
      "The Validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTaskSchema,
      "The Requested Task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The requested task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The Invalid Id error",
    ),

  },
});

export const patch = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchTaskSchema,
      "The Task to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTaskSchema,
      "The Updated Task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The requested task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchTaskSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "The Validation error(s)",
    ),
  },
});

export const remove = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Task Deleted Successfully"),
      "Task Deletion Successful",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The requested task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The Invalid Id error(s)",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;

// HOW TO USE LIST IN YOUR HANDLER
// export const list = createRoute({
//   tags,
//   path: "/tasks",
//   method: "get",
//   responses: {
//     [HttpStatusCodes.OK]: jsonContent(
//       z.array(z.object({
//         name: z.string(),
//         done: z.boolean(),
//       })),
//       "List of tasks",
//     ),
//   },
// });

// HOW TO WRITE NOT FOUND RESPONSE
// [HttpStatusCodes.NOT_FOUND]: jsonContent(
//       z.object({
//         message: z.string(),
//       }).openapi({
//         example: {
//           message: "Not Found",
//         },
//       }),
//       "The requested task not found",
//     ),

// IN THIS CASE..IT USES ANYOF..BUT THAT IS DANGEROUS IN SOME CASES..SO WE ARE USING ONEOF FROM THE STOKER LIBRARY
// [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(insertTaskSchema).or(createErrorSchema(IdParamsSchema)),
//       "The Validation error(s)",
//     )
