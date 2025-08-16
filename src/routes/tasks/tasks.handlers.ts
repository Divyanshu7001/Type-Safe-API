import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types.ts";

import db from "@/db/index.ts";
import { tasks } from "@/db/schema.ts";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./tasks.routes.ts";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.tasks.findMany();

  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { done, name } = c.req.valid("json");

  const [insertedTask] = await db
    .insert(tasks)
    .values({
      done,
      name,
    })
    .returning();

  return c.json(insertedTask, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task) {
    return c.json({
      message: "Task Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const update = c.req.valid("json");
  const [updatedTask] = await db.update(tasks)
    .set(update)
    .where(eq(tasks.id, id))
    .returning();

  if (!updatedTask) {
    return c.json({
      message: "Task Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(updatedTask, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await db.delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  console.log(result);
  if (result.length === 0) {
    return c.json({
      message: "Task Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json({
    message: "Task Deleted Successfully",
  }, HttpStatusCodes.OK);
};
