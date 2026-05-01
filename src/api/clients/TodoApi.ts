import type { APIRequestContext } from "@playwright/test";
import { todoListResponseSchema, todoSchema, type Todo } from "../schemas/todo.schema.js";
import { BaseApiClient } from "./BaseApiClient.js";

export class TodoApi extends BaseApiClient {
  constructor(
    request: APIRequestContext,
    baseUrl: string,
    private readonly token: string,
  ) {
    super(request, baseUrl);
  }

  private headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async list(): Promise<Todo[]> {
    const res = await this.request.get(`${this.baseUrl}/api/todos`, {
      headers: this.headers(),
    });
    const data = await this.parseJson(res, todoListResponseSchema);
    return data.items;
  }

  async create(title: string): Promise<Todo> {
    const res = await this.request.post(`${this.baseUrl}/api/todos`, {
      headers: this.headers(),
      data: { title },
    });
    return this.parseJson(res, todoSchema);
  }

  async getById(id: string): Promise<Todo> {
    const res = await this.request.get(`${this.baseUrl}/api/todos/${id}`, {
      headers: this.headers(),
    });
    return this.parseJson(res, todoSchema);
  }

  async delete(id: string): Promise<void> {
    const res = await this.request.delete(`${this.baseUrl}/api/todos/${id}`, {
      headers: this.headers(),
    });
    if (!res.ok()) {
      const body = await res.text();
      throw new Error(`API ${res.status()}: ${body}`);
    }
  }
}
