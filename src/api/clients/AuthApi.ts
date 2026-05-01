import type { APIRequestContext } from "@playwright/test";
import { loginResponseSchema } from "../schemas/todo.schema.js";
import { BaseApiClient } from "./BaseApiClient.js";

export class AuthApi extends BaseApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async login(username: string, password: string): Promise<string> {
    const res = await this.request.post(`${this.baseUrl}/api/auth/login`, {
      data: { username, password },
    });
    const data = await this.parseJson(res, loginResponseSchema);
    return data.token;
  }
}
