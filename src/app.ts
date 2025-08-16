import configureOpenApi from "@/lib/configure-open-api.ts";
import createApp from "@/lib/create-app.ts";
import index from "@/routes/index.route.ts";
import tasks from "@/routes/tasks/tasks.index.ts";

const app = createApp();

const routes = [index, tasks];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

app.get("/error", (c) => {
  c.status(500);
  c.var.logger.info("This is an error");
  throw new Error("This is an error");
});

export default app;
