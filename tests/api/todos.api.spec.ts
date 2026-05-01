import { test, expect } from "../../src/fixtures/lab.fixture.js";
import { loadEnv } from "../../src/config/env.js";
import { uniqueName } from "../../src/utils/uniqueName.js";

const env = loadEnv();

test.describe("Todo API", () => {
  test("list returns array shape", async ({ todoApi }) => {
    const items = await todoApi.list();
    expect(Array.isArray(items)).toBe(true);
  });

  test("create returns persisted todo", async ({ todoApi }) => {
    const title = uniqueName("task");
    const created = await todoApi.create(title);
    expect(created.title).toBe(title);
    expect(created.completed).toBe(false);

    const byId = await todoApi.getById(created.id);
    expect(byId.title).toBe(title);

    const list = await todoApi.list();
    expect(list.some((t) => t.id === created.id)).toBe(true);
  });

  test("delete removes todo", async ({ todoApi }) => {
    const created = await todoApi.create(uniqueName("del"));
    await todoApi.delete(created.id);
    const list = await todoApi.list();
    expect(list.find((t) => t.id === created.id)).toBeUndefined();
  });

  test("unauthorized request is rejected", async ({ request }) => {
    const res = await request.get(`${env.BASE_URL}/api/todos`);
    expect(res.status()).toBe(401);
  });
});
