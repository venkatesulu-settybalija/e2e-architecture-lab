import { test, expect } from "../../src/fixtures/lab.fixture.js";
import { loadEnv } from "../../src/config/env.js";
import { uniqueName } from "../../src/utils/uniqueName.js";

const env = loadEnv();

test.describe("Todo UI", () => {
  test("user can log in and add a task", async ({ todoPage }) => {
    await todoPage.goto(env.BASE_URL);
    await expect(todoPage.loginSection).toBeVisible();

    await todoPage.login(env.DEMO_USER, env.DEMO_PASS);

    await expect(todoPage.appSection).toBeVisible();
    await expect(todoPage.loginSection).toBeHidden();

    const title = uniqueName("ui-task");
    await todoPage.addTodo(title);

    await expect(todoPage.todoByTitle(title)).toBeVisible();
  });

  test("invalid login shows error", async ({ page: p, todoPage }) => {
    await todoPage.goto(env.BASE_URL);
    await todoPage.login("wrong", "creds");
    await expect(p.getByTestId("login-error")).toBeVisible();
    await expect(todoPage.appSection).toBeHidden();
  });
});
