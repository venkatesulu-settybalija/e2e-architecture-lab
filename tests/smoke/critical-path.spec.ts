import { test, expect } from "../../src/fixtures/lab.fixture.js";
import { loadEnv } from "../../src/config/env.js";
import { AuthApi } from "../../src/api/clients/AuthApi.js";
import { TodoApi } from "../../src/api/clients/TodoApi.js";
import { uniqueName } from "../../src/utils/uniqueName.js";

const env = loadEnv();

/**
 * Thin cross-stack check: API creates data, browser proves it surfaces in UI.
 * Keeps smoke tier meaningful without duplicating full regression.
 */
test("API-created todo appears in UI list", async ({ todoPage, request }) => {
  const auth = new AuthApi(request, env.BASE_URL);
  const token = await auth.login(env.DEMO_USER, env.DEMO_PASS);
  const api = new TodoApi(request, env.BASE_URL, token);
  const title = uniqueName("smoke");
  await api.create(title);

  await todoPage.goto(env.BASE_URL);
  await todoPage.login(env.DEMO_USER, env.DEMO_PASS);
  await expect(todoPage.todoByTitle(title)).toBeVisible();
});
