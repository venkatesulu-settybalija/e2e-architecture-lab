import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { z } from "zod";

export class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseUrl: string,
  ) {}

  protected async parseJson<T>(response: APIResponse, schema?: z.ZodType<T>): Promise<T> {
    const body = (await response.json()) as unknown;
    if (!response.ok()) {
      const err = body as { message?: string };
      throw new Error(`API ${response.status()}: ${err.message ?? JSON.stringify(body)}`);
    }
    return schema ? schema.parse(body) : (body as T);
  }
}
