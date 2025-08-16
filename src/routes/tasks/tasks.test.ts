/* eslint-disable no-console */
import { describe, expectTypeOf, it } from "vitest";

import router from "./tasks.index.ts";

describe("tasks List", () => {

  it("responds with an array", async () => {
    const response = await router.request("/tasks");
    const result = await response.text();
    console.log(result);
    expectTypeOf(result).toBeArray();
  });

});
