import { test as base, expect } from "@playwright/test";
import { loadEnv } from "../config/env.js";
import { AuthApi } from "../api/clients/AuthApi.js";
import { TodoApi } from "../api/clients/TodoApi.js";
import { TodoPage } from "../ui/pages/TodoPage.js";

const env = loadEnv();

/** Reset in-memory demo data (server must run with DEMO_ENABLE_RESET=true). */
export async function resetDemoState(request: import("@playwright/test").APIRequestContext) {
  const res = await request.post(`${env.BASE_URL}/api/__reset`);
  expect(res.status(), "reset endpoint — enable DEMO_ENABLE_RESET on demo server").toBe(204);
}

export const test = base.extend<{ todoApi: TodoApi; todoPage: TodoPage }>({
  _cleanup: [
    async ({ request }, use) => {
      await resetDemoState(request);
      await use(undefined);
    },
    { auto: true },
  ],

  todoApi: async ({ request }, use) => {
    const auth = new AuthApi(request, env.BASE_URL);
    const token = await auth.login(env.DEMO_USER, env.DEMO_PASS);
    const api = new TodoApi(request, env.BASE_URL, token);
    await use(api);
  },

  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },
});

export { expect };
