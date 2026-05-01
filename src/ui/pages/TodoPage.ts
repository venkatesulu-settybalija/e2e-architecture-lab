import type { Locator, Page } from "@playwright/test";

export class TodoPage {
  constructor(private readonly page: Page) {}

  async goto(baseUrl: string) {
    await this.page.goto(baseUrl);
  }

  get loginSection(): Locator {
    return this.page.getByTestId("login-section");
  }

  get appSection(): Locator {
    return this.page.getByTestId("app-section");
  }

  async login(username: string, password: string) {
    await this.page.getByTestId("username").fill(username);
    await this.page.getByTestId("password").fill(password);
    await this.page.getByTestId("login-button").click();
  }

  async addTodo(title: string) {
    await this.page.getByTestId("todo-title").fill(title);
    await this.page.getByTestId("add-todo").click();
  }

  todoByTitle(title: string): Locator {
    return this.page.getByTestId("todo-item").filter({ hasText: title });
  }
}
